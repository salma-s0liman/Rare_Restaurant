import { AddressRepository } from "./address.repository";
import { BadRequestException, NotFoundException } from "../../common";
import { ICreateAddressBodyDto, IUpdateAddressBodyDto } from "./address.dto";

export class AddressService {
  constructor(private addressRepo: AddressRepository) {}

  async createAddress(userId: string, data: ICreateAddressBodyDto) {
    const address = await this.addressRepo.create({
      street: data.street,
      city: data.city,
      postal_code: data.postalCode,
      country: data.country,
      is_primary: data.is_primary || false,
      user: { id: userId } as any,
    });

    // If this is set as primary, unset other primary addresses
    if (data.is_primary) {
      const userAddresses = await this.addressRepo.find({
        user: { id: userId } as any,
      });

      for (const addr of userAddresses) {
        if (addr.id !== address.id && addr.is_primary) {
          await this.addressRepo.update(addr.id, { is_primary: false });
        }
      }
    }

    return address;
  }

  async getUserAddresses(userId: string) {
    return this.addressRepo.find({
      user: { id: userId } as any,
    });
  }

  async getAddressById(id: string, userId: string) {
    const address = await this.addressRepo.findById(id);

    if (!address) {
      throw new NotFoundException("Address not found");
    }

    if (address.user.id !== userId) {
      throw new BadRequestException("You don't have access to this address");
    }

    return address;
  }

  async updateAddress(id: string, userId: string, data: IUpdateAddressBodyDto) {
    const address = await this.getAddressById(id, userId);

    const updated = await this.addressRepo.update(id, {
      street: data.street ?? address.street,
      city: data.city ?? address.city,
      postal_code: data.postalCode ?? address.postal_code,
      country: data.country ?? address.country,
      is_primary: data.is_primary ?? address.is_primary,
    });

    // If this is set as primary, unset other primary addresses
    if (data.is_primary) {
      const userAddresses = await this.addressRepo.find({
        user: { id: userId } as any,
      });

      for (const addr of userAddresses) {
        if (addr.id !== id && addr.is_primary) {
          await this.addressRepo.update(addr.id, { is_primary: false });
        }
      }
    }

    return updated;
  }

  async deleteAddress(id: string, userId: string) {
    await this.getAddressById(id, userId);
    const deleted = await this.addressRepo.delete(id);

    if (!deleted) {
      throw new BadRequestException("Failed to delete address");
    }

    return true;
  }

  async setPrimaryAddress(id: string, userId: string) {
    const address = await this.getAddressById(id, userId);

    // Check if address is already primary
    if (address.is_primary) {
      throw new BadRequestException("This address is already set as primary");
    }

    // Unset all primary addresses for this user
    const userAddresses = await this.addressRepo.find({
      user: { id: userId } as any,
    });

    for (const addr of userAddresses) {
      if (addr.is_primary) {
        await this.addressRepo.update(addr.id, { is_primary: false });
      }
    }

    // Set this address as primary
    return this.addressRepo.update(id, { is_primary: true });
  }
}

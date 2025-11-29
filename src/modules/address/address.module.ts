import { Router } from "express";
import { DataSource, Repository } from "typeorm";
import { Address } from "../../DB/entity/address";
import { AddressRepository } from "./address.repository";
import { AddressService } from "./address.service";
import { AddressController } from "./address.controller";
import { addressRoutes } from "./address.routes";

export function AddressModule(dataSource: DataSource): Router {
  const addressRepo: Repository<Address> = dataSource.getRepository(Address);

  const addressRepository = new AddressRepository(addressRepo);
  const addressService = new AddressService(addressRepository);
  const addressController = new AddressController(addressService);

  return addressRoutes(addressController);
}

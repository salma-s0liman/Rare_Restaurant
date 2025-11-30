import { Repository } from "typeorm";
import { User } from "../../../DB/entity/user";
import { BaseRepository } from "../../../common/repositories/BaseRepository";
import { 
  BadRequestException,
  ApplicationException 
} from "../../../common";

export class UserRepository extends BaseRepository<User> {
  constructor(repo: Repository<User>) {
    super(repo);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.findOne({ where: { phone } });
  }

  async findByEmailOrPhone(email: string, phone: string): Promise<User | null> {
    return this.findOne({ 
      where: [
        { email },
        { phone }
      ]
    });
  }

  async findActiveUsers(role?: string): Promise<User[]> {
    const where: any = { is_active: true };
    if (role) {
      where.role = role;
    }
    return this.findAll({ where });
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.update(userId, { 
        lastLoginAt: new Date() 
      });
    } catch (error: any) {
      throw new ApplicationException(`Failed to update last login: ${error.message}`);
    }
  }

  async findByIdWithRelations(userId: string): Promise<User | null> {
    return this.findOne({
      where: { id: userId },
      relations: ['addresses', 'orders', 'ratingsReviews']
    });
  }

  async searchUsers(searchTerm: string, role?: string): Promise<User[]> {
    if (!searchTerm) {
      throw new BadRequestException("Search term is required");
    }

    try {
      const queryBuilder = this.repo.createQueryBuilder("user");
      
      queryBuilder.where(
        "(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)",
        { search: `%${searchTerm}%` }
      );

      if (role) {
        queryBuilder.andWhere("user.role = :role", { role });
      }

      return await queryBuilder.getMany();
    } catch (error: any) {
      throw new ApplicationException(`Failed to search users: ${error.message}`);
    }
  }

  async getUserStats(userId: string): Promise<any> {
    try {
      const user = await this.findOne({
        where: { id: userId },
        relations: ['orders', 'addresses', 'ratingsReviews']
      });

      if (!user) {
        return null;
      }

      return {
        totalOrders: user.orders?.length || 0,
        totalAddresses: user.addresses?.length || 0,
        totalReviews: user.ratingsReviews?.length || 0,
        memberSince: user.createdAt,
        lastLogin: user.lastLoginAt
      };
    } catch (error: any) {
      throw new ApplicationException(`Failed to get user stats: ${error.message}`);
    }
  }

  async deactivateUser(userId: string): Promise<boolean> {
    try {
      const result = await this.update(userId, { is_active: false });
      return !!result;
    } catch (error: any) {
      throw new ApplicationException(`Failed to deactivate user: ${error.message}`);
    }
  }

  async reactivateUser(userId: string): Promise<boolean> {
    try {
      const result = await this.update(userId, { is_active: true });
      return !!result;
    } catch (error: any) {
      throw new ApplicationException(`Failed to reactivate user: ${error.message}`);
    }
  }
}
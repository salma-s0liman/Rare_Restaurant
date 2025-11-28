import { RestaurantRepository } from "../repositories/restaurant.repository";
import { CategoryRepository } from "../repositories/category.repository";
import {
  CreateRestaurantDto,
  UpdateRestaurantDto,
} from "../dtos/restaurant.dto";
import { AppDataSource } from "../../../DB/data-source";
import { RestaurantAdmin } from "../../../DB";
import { restaurantAdminRoleEnum, userRoleEnum } from "../../../common/enums";
import { userRepository } from "../../user/user.repository";

export class RestaurantService {
  constructor(
    private restaurantRepo: RestaurantRepository,
    private categoryRepo: CategoryRepository
  ) {}

  async createRestaurant(data: CreateRestaurantDto, ownerId: string) {
    // Create restaurant
    const restaurant = await this.restaurantRepo.create(data);

    // Auto-assign creator as owner in RestaurantAdmin table
    const adminRepo = AppDataSource.getRepository(RestaurantAdmin);
    const restaurantAdmin = adminRepo.create({
      user: { id: ownerId } as any,
      restaurant: { id: restaurant.id } as any,
      role: restaurantAdminRoleEnum.owner,
    });

    await adminRepo.save(restaurantAdmin);

    // Update user's system role to owner
    const user = await userRepository.findById(ownerId);
    if (user && user.role !== userRoleEnum.owner) {
      user.role = userRoleEnum.owner;
      await userRepository.save(user);
    }

    return restaurant;
  }

  async getAllRestaurants() {
    return await this.restaurantRepo.findAll();
  }

  async getRestaurantById(id: string) {
    return await this.restaurantRepo.findById(id, [
      "admins",
      "categories",
      "menu_items",
    ]);
  }

  async updateRestaurant(id: string, data: UpdateRestaurantDto) {
    return await this.restaurantRepo.update(id, data);
  }

  async deleteRestaurant(id: string) {
    return await this.restaurantRepo.delete(id);
  }

  async getCategoriesByRestaurant(restaurantId: string) {
    return await this.categoryRepo.findByRestaurant(restaurantId);
  }
}

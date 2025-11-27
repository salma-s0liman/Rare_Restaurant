import { RestaurantRepository } from "../repositories/restaurant.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { CreateRestaurantDto, UpdateRestaurantDto } from "../dtos/restaurant.dto";

export class RestaurantService {
  constructor(
    private restaurantRepo: RestaurantRepository,
    private categoryRepo: CategoryRepository,
  ) {}

  async createRestaurant(data: CreateRestaurantDto) {
    return await this.restaurantRepo.create(data);
  }

  async getAllRestaurants() {
    return await this.restaurantRepo.findAll();
  }

  async getRestaurantById(id: string) {
    return await this.restaurantRepo.findById(id, [
      "admins",
      "categories",
      "menuItems",
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

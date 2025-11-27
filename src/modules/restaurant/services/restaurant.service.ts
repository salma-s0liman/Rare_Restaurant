import { RestaurantRepository } from "../repositories/restaurant.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { CreateRestaurantDto, UpdateRestaurantDto } from "../dtos/restaurant.dto";
import { 
  NotfoundException, 
  BadRequestException,
  ConflictException 
} from "../../../common";

export class RestaurantService {
  constructor(
    private restaurantRepo: RestaurantRepository,
    private categoryRepo: CategoryRepository,
  ) {}

  async createRestaurant(data: CreateRestaurantDto) {
    try {
      // Check for duplicate restaurant name (optional business rule)
      const existingByName = await this.restaurantRepo.findOne({
        where: { name: data.name }
      });

      if (existingByName) {
        throw new ConflictException(
          `Restaurant with name '${data.name}' already exists`
        );
      }

      return await this.restaurantRepo.create(data);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException("Failed to create restaurant");
    }
  }

  async getAllRestaurants() {
    try {
      // Only return active restaurants unless specifically requested
      return await this.restaurantRepo.findActive();
    } catch (error) {
      throw new BadRequestException("Failed to retrieve restaurants");
    }
  }

  async getRestaurantById(id: string) {
    if (!id) {
      throw new BadRequestException("Restaurant ID is required");
    }

    const restaurant = await this.restaurantRepo.findById(id, [
      "admins",
      "categories",
      "menu_items",
    ]);

    if (!restaurant) {
      throw new NotfoundException(`Restaurant with ID '${id}' not found`);
    }

    // Check if restaurant is soft-deleted (inactive)
    if (!restaurant.is_active) {
      throw new NotfoundException("Restaurant is not currently available");
    }

    return restaurant;
  }

  async updateRestaurant(id: string, data: UpdateRestaurantDto) {
    if (!id) {
      throw new BadRequestException("Restaurant ID is required");
    }

    // Verify restaurant exists and is active
    const existingRestaurant = await this.restaurantRepo.findById(id);
    if (!existingRestaurant) {
      throw new NotfoundException(`Restaurant with ID '${id}' not found`);
    }

    if (!existingRestaurant.is_active) {
      throw new BadRequestException("Cannot update inactive restaurant");
    }

    // Check for name conflicts if name is being updated
    if (data.name && data.name !== existingRestaurant.name) {
      const nameConflict = await this.restaurantRepo.findOne({
        where: { name: data.name }
      });

      if (nameConflict && nameConflict.id !== id) {
        throw new ConflictException(
          `Restaurant with name '${data.name}' already exists`
        );
      }
    }

    try {
      const updatedRestaurant = await this.restaurantRepo.update(id, data);
      if (!updatedRestaurant) {
        throw new BadRequestException("Failed to update restaurant");
      }
      return updatedRestaurant;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException("Failed to update restaurant");
    }
  }

  async deleteRestaurant(id: string) {
    if (!id) {
      throw new BadRequestException("Restaurant ID is required");
    }

    // Verify restaurant exists
    const restaurant = await this.restaurantRepo.findById(id);
    if (!restaurant) {
      throw new NotfoundException(`Restaurant with ID '${id}' not found`);
    }

    // Check if restaurant has active dependencies
    const categoriesCount = await this.categoryRepo.findByRestaurant(id);
    if (categoriesCount.length > 0) {
      throw new BadRequestException(
        "Cannot delete restaurant with existing categories. Please delete all categories first."
      );
    }

    try {
      // Soft delete by setting is_active to false instead of hard delete
      const result = await this.restaurantRepo.update(id, { is_active: false });
      return !!result;
    } catch (error) {
      throw new BadRequestException("Failed to delete restaurant");
    }
  }

  async getCategoriesByRestaurant(restaurantId: string) {
    if (!restaurantId) {
      throw new BadRequestException("Restaurant ID is required");
    }

    // Verify restaurant exists and is active
    await this.getRestaurantById(restaurantId);

    try {
      return await this.categoryRepo.findByRestaurant(restaurantId);
    } catch (error) {
      throw new BadRequestException("Failed to retrieve categories");
    }
  }
}

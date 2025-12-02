import { CategoryRepository } from "../repositories/category.repository";
import { RestaurantRepository } from "../repositories/restaurant.repository";
import { CreateCategoryDto, UpdateCategoryDto } from "../dtos/category.dto";
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "../../../common";
import { AppDataSource } from "../../../DB/data-source";
import { RestaurantAdmin } from "../../../DB";

export class CategoryService {
  constructor(
    private categoryRepo: CategoryRepository,
    private restaurantRepo?: RestaurantRepository
  ) {}

  async createCategory(data: CreateCategoryDto, userId: string) {
    if (!data.restaurantId) {
      throw new BadRequestException("Restaurant ID is required");
    }

    // Verify restaurant exists and is active
    const restaurant = await this.restaurantRepo?.findById(data.restaurantId);
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID '${data.restaurantId}' not found`
      );
    }

    if (!restaurant.is_active) {
      throw new BadRequestException(
        "Cannot create category for inactive restaurant"
      );
    }

    // Check if user is admin of this restaurant
    const adminRepo = AppDataSource.getRepository(RestaurantAdmin);
    const isAdmin = await adminRepo.findOne({
      where: {
        user: { id: userId } as any,
        restaurant: { id: data.restaurantId } as any,
      },
    });

    if (!isAdmin) {
      throw new BadRequestException(
        "You don't have permission to create categories for this restaurant"
      );
    }

    // Check for duplicate category name within the same restaurant
    const existingCategories = await this.categoryRepo.findByRestaurant(
      data.restaurantId
    );
    const nameConflict = existingCategories.find(
      (category) => category.name.toLowerCase() === data.name.toLowerCase()
    );

    if (nameConflict) {
      throw new ConflictException(
        `Category with name '${data.name}' already exists in this restaurant`
      );
    }

    try {
      return await this.categoryRepo.create({
        ...data,
        restaurant: { id: data.restaurantId } as any,
      });
    } catch (error) {
      throw new BadRequestException("Failed to create category");
    }
  }

  async getCategories(restaurantId: string) {
    if (!restaurantId) {
      throw new BadRequestException("Restaurant ID is required");
    }

    // Verify restaurant exists and is active
    const restaurant = await this.restaurantRepo?.findById(restaurantId);
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID '${restaurantId}' not found`
      );
    }

    if (!restaurant.is_active) {
      throw new BadRequestException("Restaurant is not currently available");
    }

    try {
      return await this.categoryRepo.findByRestaurant(restaurantId);
    } catch (error) {
      throw new BadRequestException("Failed to retrieve categories");
    }
  }

  async updateCategory(id: string, data: UpdateCategoryDto, userId: string) {
    if (!id) {
      throw new BadRequestException("Category ID is required");
    }

    // Verify category exists
    const existingCategory = await this.categoryRepo.findById(id, [
      "restaurant",
    ]);
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    // Verify restaurant is still active
    if (!existingCategory.restaurant?.is_active) {
      throw new BadRequestException(
        "Cannot update category for inactive restaurant"
      );
    }

    // Check if user is admin of this restaurant
    const adminRepo = AppDataSource.getRepository(RestaurantAdmin);
    const isAdmin = await adminRepo.findOne({
      where: {
        user: { id: userId } as any,
        restaurant: { id: existingCategory.restaurant.id } as any,
      },
    });

    if (!isAdmin) {
      throw new BadRequestException(
        "You don't have permission to update this category"
      );
    }

    // Check for name conflicts within the same restaurant if name is being updated
    if (data.name && data.name !== existingCategory.name) {
      const siblingCategories = await this.categoryRepo.findByRestaurant(
        existingCategory.restaurant.id
      );

      const nameConflict = siblingCategories.find(
        (category) =>
          category.id !== id &&
          category.name.toLowerCase() === data.name!.toLowerCase()
      );

      if (nameConflict) {
        throw new ConflictException(
          `Category with name '${data.name}' already exists in this restaurant`
        );
      }
    }

    try {
      const updatedCategory = await this.categoryRepo.update(id, data);
      if (!updatedCategory) {
        throw new BadRequestException("Failed to update category");
      }
      return updatedCategory;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException("Failed to update category");
    }
  }

  async deleteCategory(id: string, userId: string) {
    if (!id) {
      throw new BadRequestException("Category ID is required");
    }

    // Verify category exists
    const category = await this.categoryRepo.findById(id, [
      "restaurant",
      "menu_items",
    ]);
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    // Check if category has menu items
    if (category.menu_items && category.menu_items.length > 0) {
      throw new BadRequestException(
        "Cannot delete category with existing menu items. Please delete all menu items first or reassign them to another category."
      );
    }

    // Verify restaurant is active
    if (!category.restaurant?.is_active) {
      throw new BadRequestException(
        "Cannot delete category from inactive restaurant"
      );
    }

    // Check if user is admin of this restaurant
    const adminRepo = AppDataSource.getRepository(RestaurantAdmin);
    const isAdmin = await adminRepo.findOne({
      where: {
        user: { id: userId } as any,
        restaurant: { id: category.restaurant.id } as any,
      },
    });

    if (!isAdmin) {
      throw new BadRequestException(
        "You don't have permission to delete this category"
      );
    }

    try {
      const result = await this.categoryRepo.delete(id);
      return result;
    } catch (error) {
      throw new BadRequestException("Failed to delete category");
    }
  }
}

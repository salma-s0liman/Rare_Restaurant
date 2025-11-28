import { MenuItemRepository } from "../repositories/menuItem.repository";
import { MenuItemImageRepository } from "../repositories/menuItemImage.repository";
import { RestaurantRepository } from "../repositories/restaurant.repository";
import { CategoryRepository } from "../repositories/category.repository";
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from "../dtos/menuItem.dto";
import {
  CreateMenuItemImageDto,
} from "../dtos/menuItemImage.dto";
import { 
  NotfoundException, 
  BadRequestException,
  ConflictException 
} from "../../../common";

export class MenuItemService {
  constructor(
    private menuItemRepo: MenuItemRepository,
    private imageRepo: MenuItemImageRepository,
    private restaurantRepo?: RestaurantRepository,
    private categoryRepo?: CategoryRepository
  ) {}

  async createMenuItem(data: CreateMenuItemDto) {
    if (!data.restaurantId) {
      throw new BadRequestException("Restaurant ID is required");
    }

    if (!data.categoryId) {
      throw new BadRequestException("Category ID is required");
    }

    // Verify restaurant exists and is active
    const restaurant = await this.restaurantRepo?.findById(data.restaurantId);
    if (!restaurant) {
      throw new NotfoundException(`Restaurant with ID '${data.restaurantId}' not found`);
    }

    if (!restaurant.is_active) {
      throw new BadRequestException("Cannot create menu item for inactive restaurant");
    }

    // Verify category exists and belongs to the restaurant
    const category = await this.categoryRepo?.findById(data.categoryId, ["restaurant"]);
    if (!category) {
      throw new NotfoundException(`Category with ID '${data.categoryId}' not found`);
    }

    if (category.restaurant.id !== data.restaurantId) {
      throw new BadRequestException("Category does not belong to the specified restaurant");
    }

    // Validate price
    if (data.price <= 0) {
      throw new BadRequestException("Price must be greater than 0");
    }

    // Check for duplicate menu item name within the same restaurant
    const existingMenuItems = await this.menuItemRepo.findByRestaurant(data.restaurantId);
    const nameConflict = existingMenuItems.find(
      item => item.name.toLowerCase() === data.name.toLowerCase()
    );

    if (nameConflict) {
      throw new ConflictException(
        `Menu item with name '${data.name}' already exists in this restaurant`
      );
    }

    try {
      return await this.menuItemRepo.create({
        ...data,
        restaurant: { id: data.restaurantId } as any,
        category: { id: data.categoryId } as any
      });
    } catch (error) {
      throw new BadRequestException("Failed to create menu item");
    }
  }

  async getMenuItems(restaurantId: string) {
    if (!restaurantId) {
      throw new BadRequestException("Restaurant ID is required");
    }

    // Verify restaurant exists and is active
    const restaurant = await this.restaurantRepo?.findById(restaurantId);
    if (!restaurant) {
      throw new NotfoundException(`Restaurant with ID '${restaurantId}' not found`);
    }

    if (!restaurant.is_active) {
      throw new BadRequestException("Restaurant is not currently available");
    }

    try {
      return await this.menuItemRepo.findByRestaurant(restaurantId);
    } catch (error) {
      throw new BadRequestException("Failed to retrieve menu items");
    }
  }

  async updateMenuItem(id: string, data: UpdateMenuItemDto) {
    if (!id) {
      throw new BadRequestException("Menu item ID is required");
    }

    // Verify menu item exists
    const existingMenuItem = await this.menuItemRepo.findById(id, ["restaurant", "category"]);
    if (!existingMenuItem) {
      throw new NotfoundException(`Menu item with ID '${id}' not found`);
    }

    // Verify restaurant is still active
    if (!existingMenuItem.restaurant?.is_active) {
      throw new BadRequestException("Cannot update menu item for inactive restaurant");
    }

    // Validate price if being updated
    if (data.price !== undefined && data.price <= 0) {
      throw new BadRequestException("Price must be greater than 0");
    }

    // If categoryId is being updated, verify the new category exists and belongs to the same restaurant
    if (data.categoryId && data.categoryId !== existingMenuItem.category.id) {
      const newCategory = await this.categoryRepo?.findById(data.categoryId, ["restaurant"]);
      if (!newCategory) {
        throw new NotfoundException(`Category with ID '${data.categoryId}' not found`);
      }

      if (newCategory.restaurant.id !== existingMenuItem.restaurant.id) {
        throw new BadRequestException("New category must belong to the same restaurant");
      }
    }

    // Check for name conflicts within the same restaurant if name is being updated
    if (data.name && data.name !== existingMenuItem.name) {
      const siblingMenuItems = await this.menuItemRepo.findByRestaurant(
        existingMenuItem.restaurant.id
      );
      
      const nameConflict = siblingMenuItems.find(
        item => 
          item.id !== id && 
          item.name.toLowerCase() === data.name!.toLowerCase()
      );

      if (nameConflict) {
        throw new ConflictException(
          `Menu item with name '${data.name}' already exists in this restaurant`
        );
      }
    }

    try {
      const updatedMenuItem = await this.menuItemRepo.update(id, data);
      if (!updatedMenuItem) {
        throw new BadRequestException("Failed to update menu item");
      }
      return updatedMenuItem;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException("Failed to update menu item");
    }
  }

  async deleteMenuItem(id: string) {
    if (!id) {
      throw new BadRequestException("Menu item ID is required");
    }

    // Verify menu item exists
    const menuItem = await this.menuItemRepo.findById(id, ["restaurant", "images"]);
    if (!menuItem) {
      throw new NotfoundException(`Menu item with ID '${id}' not found`);
    }

    // Verify restaurant is active
    if (!menuItem.restaurant?.is_active) {
      throw new BadRequestException("Cannot delete menu item from inactive restaurant");
    }

    // Check if menu item has images and delete them first
    if (menuItem.images && menuItem.images.length > 0) {
      try {
        for (const image of menuItem.images) {
          await this.imageRepo.delete(image.id);
        }
      } catch (error) {
        throw new BadRequestException("Failed to delete associated images");
      }
    }

    try {
      const result = await this.menuItemRepo.delete(id);
      return result;
    } catch (error) {
      throw new BadRequestException("Failed to delete menu item");
    }
  }

  // IMAGES
  async addImage(menuItemId: string, data: CreateMenuItemImageDto) {
    if (!menuItemId) {
      throw new BadRequestException("Menu item ID is required");
    }

    // Verify menu item exists
    const menuItem = await this.menuItemRepo.findById(menuItemId, ["restaurant"]);
    if (!menuItem) {
      throw new NotfoundException(`Menu item with ID '${menuItemId}' not found`);
    }

    // Verify restaurant is active
    if (!menuItem.restaurant?.is_active) {
      throw new BadRequestException("Cannot add image to menu item from inactive restaurant");
    }

    try {
      return await this.imageRepo.create({
        ...data,
        menu_item: { id: menuItemId } as any,
      });
    } catch (error) {
      throw new BadRequestException("Failed to add image");
    }
  }

  async getImages(menuItemId: string) {
    if (!menuItemId) {
      throw new BadRequestException("Menu item ID is required");
    }

    // Verify menu item exists
    const menuItem = await this.menuItemRepo.findById(menuItemId, ["restaurant"]);
    if (!menuItem) {
      throw new NotfoundException(`Menu item with ID '${menuItemId}' not found`);
    }

    // Verify restaurant is active
    if (!menuItem.restaurant?.is_active) {
      throw new BadRequestException("Cannot retrieve images from inactive restaurant");
    }

    try {
      return await this.imageRepo.findByMenuItem(menuItemId);
    } catch (error) {
      throw new BadRequestException("Failed to retrieve images");
    }
  }
}

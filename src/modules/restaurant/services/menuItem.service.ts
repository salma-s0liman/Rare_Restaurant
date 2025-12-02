import { MenuItemRepository } from "../repositories/menuItem.repository";
import { MenuItemImageRepository } from "../repositories/menuItemImage.repository";
import { RestaurantRepository } from "../repositories/restaurant.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { CreateMenuItemDto, UpdateMenuItemDto } from "../dtos/menuItem.dto";
import { CreateMenuItemImageDto } from "../dtos/menuItemImage.dto";
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "../../../common";
import { AppDataSource } from "../../../DB/data-source";
import { RestaurantAdmin } from "../../../DB";

export class MenuItemService {
  constructor(
    private menuItemRepo: MenuItemRepository,
    private imageRepo: MenuItemImageRepository,
    private restaurantRepo?: RestaurantRepository,
    private categoryRepo?: CategoryRepository
  ) {}

  async createMenuItem(data: CreateMenuItemDto, userId: string) {
    if (!data.restaurantId) {
      throw new BadRequestException("Restaurant ID is required");
    }

    if (!data.categoryId) {
      throw new BadRequestException("Category ID is required");
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
        "Cannot create menu item for inactive restaurant"
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
        "You don't have permission to create menu items for this restaurant"
      );
    }

    // Verify category exists and belongs to the restaurant
    const category = await this.categoryRepo?.findById(data.categoryId, [
      "restaurant",
    ]);
    if (!category) {
      throw new NotFoundException(
        `Category with ID '${data.categoryId}' not found`
      );
    }

    if (category.restaurant.id !== data.restaurantId) {
      throw new BadRequestException(
        "Category does not belong to the specified restaurant"
      );
    }

    // Validate price
    if (data.price <= 0) {
      throw new BadRequestException("Price must be greater than 0");
    }

    // Check for duplicate menu item name within the same restaurant
    const existingMenuItems = await this.menuItemRepo.findByRestaurant(
      data.restaurantId
    );
    const nameConflict = existingMenuItems.find(
      (item) => item.name.toLowerCase() === data.name.toLowerCase()
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
        category: { id: data.categoryId } as any,
      });
    } catch (error) {
      throw new BadRequestException("Failed to create menu item");
    }
  }

  async getMenuItems(restaurantId: string, categoryId?: string) {
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

    // If categoryId is provided, verify it exists and belongs to the restaurant
    if (categoryId) {
      const category = await this.categoryRepo?.findById(categoryId, [
        "restaurant",
      ]);
      if (!category) {
        throw new NotFoundException(
          `Category with ID '${categoryId}' not found`
        );
      }
      if (category.restaurant.id !== restaurantId) {
        throw new BadRequestException(
          "Category does not belong to this restaurant"
        );
      }
    }

    try {
      const allItems = await this.menuItemRepo.findByRestaurant(restaurantId);

      // Filter by category if provided
      if (categoryId) {
        return allItems.filter((item) => item.category.id === categoryId);
      }

      return allItems;
    } catch (error) {
      throw new BadRequestException("Failed to retrieve menu items");
    }
  }

  async updateMenuItem(id: string, data: UpdateMenuItemDto, userId: string) {
    if (!id) {
      throw new BadRequestException("Menu item ID is required");
    }

    // Verify menu item exists
    const existingMenuItem = await this.menuItemRepo.findById(id, [
      "restaurant",
      "category",
    ]);
    if (!existingMenuItem) {
      throw new NotFoundException(`Menu item with ID '${id}' not found`);
    }

    // Verify restaurant is still active
    if (!existingMenuItem.restaurant?.is_active) {
      throw new BadRequestException(
        "Cannot update menu item for inactive restaurant"
      );
    }

    // Check if user is admin of this restaurant
    const adminRepo = AppDataSource.getRepository(RestaurantAdmin);
    const isAdmin = await adminRepo.findOne({
      where: {
        user: { id: userId } as any,
        restaurant: { id: existingMenuItem.restaurant.id } as any,
      },
    });

    if (!isAdmin) {
      throw new BadRequestException(
        "You don't have permission to update this menu item"
      );
    }

    // Validate price if being updated
    if (data.price !== undefined && data.price <= 0) {
      throw new BadRequestException("Price must be greater than 0");
    }

    // If categoryId is being updated, verify the new category exists and belongs to the same restaurant
    if (data.categoryId && data.categoryId !== existingMenuItem.category.id) {
      const newCategory = await this.categoryRepo?.findById(data.categoryId, [
        "restaurant",
      ]);
      if (!newCategory) {
        throw new NotFoundException(
          `Category with ID '${data.categoryId}' not found`
        );
      }

      if (newCategory.restaurant.id !== existingMenuItem.restaurant.id) {
        throw new BadRequestException(
          "New category must belong to the same restaurant"
        );
      }
    }

    // Check for name conflicts within the same restaurant if name is being updated
    if (data.name && data.name !== existingMenuItem.name) {
      const siblingMenuItems = await this.menuItemRepo.findByRestaurant(
        existingMenuItem.restaurant.id
      );

      const nameConflict = siblingMenuItems.find(
        (item) =>
          item.id !== id && item.name.toLowerCase() === data.name!.toLowerCase()
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
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException("Failed to update menu item");
    }
  }

  async deleteMenuItem(id: string, userId: string) {
    if (!id) {
      throw new BadRequestException("Menu item ID is required");
    }

    // Verify menu item exists
    const menuItem = await this.menuItemRepo.findById(id, [
      "restaurant",
      "images",
    ]);
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID '${id}' not found`);
    }

    // Verify restaurant is active
    if (!menuItem.restaurant?.is_active) {
      throw new BadRequestException(
        "Cannot delete menu item from inactive restaurant"
      );
    }

    // Check if user is admin of this restaurant
    const adminRepo = AppDataSource.getRepository(RestaurantAdmin);
    const isAdmin = await adminRepo.findOne({
      where: {
        user: { id: userId } as any,
        restaurant: { id: menuItem.restaurant.id } as any,
      },
    });

    if (!isAdmin) {
      throw new BadRequestException(
        "You don't have permission to delete this menu item"
      );
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
  async addImage(
    menuItemId: string,
    data: CreateMenuItemImageDto,
    userId: string
  ) {
    if (!menuItemId) {
      throw new BadRequestException("Menu item ID is required");
    }

    // Verify menu item exists
    const menuItem = await this.menuItemRepo.findById(menuItemId, [
      "restaurant",
    ]);
    if (!menuItem) {
      throw new NotFoundException(
        `Menu item with ID '${menuItemId}' not found`
      );
    }

    // Verify restaurant is active
    if (!menuItem.restaurant?.is_active) {
      throw new BadRequestException(
        "Cannot add image to menu item from inactive restaurant"
      );
    }

    // Check if user is admin of this restaurant
    const adminRepo = AppDataSource.getRepository(RestaurantAdmin);
    const isAdmin = await adminRepo.findOne({
      where: {
        user: { id: userId } as any,
        restaurant: { id: menuItem.restaurant.id } as any,
      },
    });

    if (!isAdmin) {
      throw new BadRequestException(
        "You don't have permission to add images to this menu item"
      );
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
    const menuItem = await this.menuItemRepo.findById(menuItemId, [
      "restaurant",
    ]);
    if (!menuItem) {
      throw new NotFoundException(
        `Menu item with ID '${menuItemId}' not found`
      );
    }

    // Verify restaurant is active
    if (!menuItem.restaurant?.is_active) {
      throw new BadRequestException(
        "Cannot retrieve images from inactive restaurant"
      );
    }

    try {
      return await this.imageRepo.findByMenuItem(menuItemId);
    } catch (error) {
      throw new BadRequestException("Failed to retrieve images");
    }
  }

  async updateImage(
    imageId: string,
    data: CreateMenuItemImageDto,
    userId: string
  ) {
    if (!imageId) {
      throw new BadRequestException("Image ID is required");
    }

    // Verify image exists
    const image = await this.imageRepo.findById(imageId, [
      "menu_item",
      "menu_item.restaurant",
    ]);
    if (!image) {
      throw new NotFoundException(`Image with ID '${imageId}' not found`);
    }

    // Verify restaurant is active
    if (!image.menu_item?.restaurant?.is_active) {
      throw new BadRequestException(
        "Cannot update image for inactive restaurant"
      );
    }

    // Check if user is admin of this restaurant
    const adminRepo = AppDataSource.getRepository(RestaurantAdmin);
    const isAdmin = await adminRepo.findOne({
      where: {
        user: { id: userId } as any,
        restaurant: { id: image.menu_item.restaurant.id } as any,
      },
    });

    if (!isAdmin) {
      throw new BadRequestException(
        "You don't have permission to update this image"
      );
    }

    try {
      const updated = await this.imageRepo.update(imageId, data);
      if (!updated) {
        throw new BadRequestException("Failed to update image");
      }
      return updated;
    } catch (error) {
      throw new BadRequestException("Failed to update image");
    }
  }

  async deleteImage(imageId: string, userId: string) {
    if (!imageId) {
      throw new BadRequestException("Image ID is required");
    }

    // Verify image exists
    const image = await this.imageRepo.findById(imageId, [
      "menu_item",
      "menu_item.restaurant",
    ]);
    if (!image) {
      throw new NotFoundException(`Image with ID '${imageId}' not found`);
    }

    // Verify restaurant is active
    if (!image.menu_item?.restaurant?.is_active) {
      throw new BadRequestException(
        "Cannot delete image from inactive restaurant"
      );
    }

    // Check if user is admin of this restaurant
    const adminRepo = AppDataSource.getRepository(RestaurantAdmin);
    const isAdmin = await adminRepo.findOne({
      where: {
        user: { id: userId } as any,
        restaurant: { id: image.menu_item.restaurant.id } as any,
      },
    });

    if (!isAdmin) {
      throw new BadRequestException(
        "You don't have permission to delete this image"
      );
    }

    try {
      const result = await this.imageRepo.delete(imageId);
      return result;
    } catch (error) {
      throw new BadRequestException("Failed to delete image");
    }
  }
}

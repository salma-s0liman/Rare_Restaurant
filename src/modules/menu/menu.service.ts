import { Request, Response } from "express";
import menuRepository from "./menu.repository";
import {
  MenuQueryDto,
  RestaurantQueryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateCategoryDto,
  MenuItemImageDto,
  RestaurantListDto,
  RestaurantMenuDto,
  MenuItemResponseDto,
  CategoryWithItemsDto,
} from "./menu.dto";
import { errorResponse, successResponse } from "../../common/utils/response";

class MenuService {
  // Restaurant services
  getAllRestaurants = async (req: Request, res: Response) => {
    try {
      const query: RestaurantQueryDto = {
        active_only: req.query.active_only === "false" ? false : true,
        search: req.query.search as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const result = await menuRepository.getAllRestaurants(query);

      const restaurantsDto: RestaurantListDto[] = result.restaurants.map(
        (restaurant) => ({
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address || "",
          phone: restaurant.phone || "",
          is_active: restaurant.is_active || false,
          categories_count: restaurant.categories?.length || 0,
          menu_items_count: restaurant.menu_items?.length || 0,
        })
      );

      return successResponse(
        res,
        {
          restaurants: restaurantsDto,
          pagination: result.pagination,
        },
        "Restaurants retrieved successfully"
      );
    } catch (error) {
      console.error("Get all restaurants error:", error);
      return errorResponse(res, "Failed to retrieve restaurants", 500);
    }
  };

  getRestaurantById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return errorResponse(res, "Restaurant ID is required", 400);
      }

      const restaurant = await menuRepository.getRestaurantById(id);
      if (!restaurant) {
        return errorResponse(res, "Restaurant not found", 404);
      }

      const restaurantDto: RestaurantListDto = {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address || "",
        phone: restaurant.phone || "",
        is_active: restaurant.is_active || false,
        categories_count: restaurant.categories?.length || 0,
        menu_items_count: restaurant.menu_items?.length || 0,
      };

      return successResponse(
        res,
        restaurantDto,
        "Restaurant details retrieved successfully"
      );
    } catch (error) {
      console.error("Get restaurant by ID error:", error);
      return errorResponse(res, "Failed to retrieve restaurant details", 500);
    }
  };

  getRestaurantMenu = async (req: Request, res: Response) => {
    try {
      const { id: restaurantId } = req.params;
      const query: MenuQueryDto = {
        category_id: req.query.category_id as string,
        min_price: req.query.min_price
          ? parseFloat(req.query.min_price as string)
          : undefined,
        max_price: req.query.max_price
          ? parseFloat(req.query.max_price as string)
          : undefined,
        available_only: req.query.available_only === "false" ? false : true,
        search: req.query.search as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      };

      if (!restaurantId) {
        return errorResponse(res, "Restaurant ID is required", 400);
      }
      const result = await menuRepository.getRestaurantMenu(
        restaurantId,
        query
      );
      if (!result) {
        return errorResponse(res, "Restaurant not found", 404);
      }

      const menuItemsDto: MenuItemResponseDto[] = result.menuItems.map(
        (item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          is_available: item.is_available || false,
          created_at: item.created_at!,
          category: {
            id: item.category.id,
            name: item.category.name,
            description: item.category.description || undefined,
          },
          images:
            item.images?.map((img) => ({
              id: img.id,
              url: img.url,
              alt_text: img.alt_text,
              is_primary: img.is_primary,
            })) || [],
          restaurant: {
            id: item.restaurant.id,
            name: item.restaurant.name,
          },
        })
      );

      const categoriesDto: CategoryWithItemsDto[] = result.categories.map(
        (category) => ({
          id: category.id,
          name: category.name,
          description: category.description,
          items_count: category.menu_items?.length || 0,
          menu_items:
            category.menu_items?.map((item) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              is_available: item.is_available || false,
              created_at: item.created_at!,
              category: {
                id: category.id,
                name: category.name,
                description: category.description,
              },
              images:
                item.images?.map((img) => ({
                  id: img.id,
                  url: img.url,
                  alt_text: img.alt_text,
                  is_primary: img.is_primary,
                })) || [],
              restaurant: {
                id: item.restaurant.id,
                name: item.restaurant.name,
              },
            })) || [],
        })
      );

      const restaurantMenuDto: RestaurantMenuDto = {
        restaurant: {
          id: result.restaurant.id,
          name: result.restaurant.name,
          address: result.restaurant.address || "",
          phone: result.restaurant.phone || "",
          is_active: result.restaurant.is_active || false,
        },
        categories: categoriesDto,
        total_items: result.pagination.total,
      };

      return successResponse(
        res,
        {
          ...restaurantMenuDto,
          menu_items: menuItemsDto,
          pagination: result.pagination,
        },
        "Restaurant menu retrieved successfully"
      );
    } catch (error) {
      console.error("Get restaurant menu error:", error);
      return errorResponse(res, "Failed to retrieve restaurant menu", 500);
    }
  };

  // Menu Item services
  getMenuItemById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return errorResponse(res, "Menu item ID is required", 400);
      }

      const menuItem = await menuRepository.getMenuItemById(id);
      if (!menuItem) {
        return errorResponse(res, "Menu item not found", 404);
      }

      const menuItemDto: MenuItemResponseDto = {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        is_available: menuItem.is_available || false,
        created_at: menuItem.created_at!,
        category: {
          id: menuItem.category.id,
          name: menuItem.category.name,
          description: menuItem.category.description,
        },
        images:
          menuItem.images?.map((img) => ({
            id: img.id,
            url: img.url,
            alt_text: img.alt_text,
            is_primary: img.is_primary,
          })) || [],
        restaurant: {
          id: menuItem.restaurant.id,
          name: menuItem.restaurant.name,
        },
      };

      return successResponse(
        res,
        menuItemDto,
        "Menu item details retrieved successfully"
      );
    } catch (error) {
      console.error("Get menu item by ID error:", error);
      return errorResponse(res, "Failed to retrieve menu item details", 500);
    }
  };

  // Admin services
  createMenuItem = async (req: Request, res: Response) => {
    try {
      const { restaurant_id } = req.params;
      if (!restaurant_id) {
        return errorResponse(res, "Restaurant ID is required", 400);
      }
      const data: CreateMenuItemDto = req.body;

      const menuItem = await menuRepository.createMenuItem(restaurant_id, data);
      const fullMenuItem = await menuRepository.getMenuItemById(menuItem.id);

      const menuItemDto: MenuItemResponseDto = {
        id: fullMenuItem!.id,
        name: fullMenuItem!.name,
        description: fullMenuItem!.description,
        price: fullMenuItem!.price,
        is_available: fullMenuItem!.is_available || false,
        created_at: fullMenuItem!.created_at!,
        category: {
          id: fullMenuItem!.category.id,
          name: fullMenuItem!.category.name,
          description: fullMenuItem!.category.description,
        },
        images:
          fullMenuItem!.images?.map((img) => ({
            id: img.id,
            url: img.url,
            alt_text: img.alt_text,
            is_primary: img.is_primary,
          })) || [],
        restaurant: {
          id: fullMenuItem!.restaurant.id,
          name: fullMenuItem!.restaurant.name,
        },
      };

      return successResponse(
        res,
        menuItemDto,
        "Menu item created successfully",
        201
      );
    } catch (error) {
      console.error("Create menu item error:", error);
      return errorResponse(res, "Failed to create menu item", 500);
    }
  };

  updateMenuItem = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return errorResponse(res, "Menu item ID is required", 400);
      }
      const data: UpdateMenuItemDto = req.body;

      const updatedMenuItem = await menuRepository.updateMenuItem(id, data);
      if (!updatedMenuItem) {
        return errorResponse(res, "Menu item not found", 404);
      }

      const menuItemDto: MenuItemResponseDto = {
        id: updatedMenuItem.id,
        name: updatedMenuItem.name,
        description: updatedMenuItem.description,
        price: updatedMenuItem.price,
        is_available: updatedMenuItem.is_available || false,
        created_at: updatedMenuItem.created_at!,
        category: {
          id: updatedMenuItem.category.id,
          name: updatedMenuItem.category.name,
          description: updatedMenuItem.category.description,
        },
        images:
          updatedMenuItem.images?.map((img) => ({
            id: img.id,
            url: img.url,
            alt_text: img.alt_text,
            is_primary: img.is_primary,
          })) || [],
        restaurant: {
          id: updatedMenuItem.restaurant.id,
          name: updatedMenuItem.restaurant.name,
        },
      };

      return successResponse(
        res,
        menuItemDto,
        "Menu item updated successfully"
      );
    } catch (error) {
      console.error("Update menu item error:", error);
      return errorResponse(res, "Failed to update menu item", 500);
    }
  };

  deleteMenuItem = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return errorResponse(res, "Menu item ID is required", 400);
      }

      const deleted = await menuRepository.deleteMenuItem(id);
      if (!deleted) {
        return errorResponse(res, "Menu item not found", 404);
      }

      return successResponse(res, null, "Menu item deleted successfully");
    } catch (error) {
      console.error("Delete menu item error:", error);
      return errorResponse(res, "Failed to delete menu item", 500);
    }
  };

  // Category admin services
  createCategory = async (req: Request, res: Response) => {
    try {
      const { restaurant_id } = req.params;
      if (!restaurant_id) {
        return errorResponse(res, "Restaurant ID is required", 400);
      }
      const data: CreateCategoryDto = req.body;

      const category = await menuRepository.createCategory(restaurant_id, data);
      return successResponse(
        res,
        category,
        "Category created successfully",
        201
      );
    } catch (error) {
      console.error("Create category error:", error);
      return errorResponse(res, "Failed to create category", 500);
    }
  };

  // Menu item image services
  addMenuItemImage = async (req: Request, res: Response) => {
    try {
      const { menu_item_id } = req.params;
      if (!menu_item_id) {
        return errorResponse(res, "Menu item ID is required", 400);
      }
      const data: MenuItemImageDto = req.body;

      const image = await menuRepository.addMenuItemImage(menu_item_id, data);
      return successResponse(
        res,
        image,
        "Menu item image added successfully",
        201
      );
    } catch (error) {
      console.error("Add menu item image error:", error);
      return errorResponse(res, "Failed to add menu item image", 500);
    }
  };

  removeMenuItemImage = async (req: Request, res: Response) => {
    try {
      const { image_id } = req.params;
      if (!image_id) {
        return errorResponse(res, "Image ID is required", 400);
      }

      const deleted = await menuRepository.removeMenuItemImage(image_id);
      if (!deleted) {
        return errorResponse(res, "Image not found", 404);
      }

      return successResponse(res, null, "Menu item image removed successfully");
    } catch (error) {
      console.error("Remove menu item image error:", error);
      return errorResponse(res, "Failed to remove menu item image", 500);
    }
  };
}

export default new MenuService();

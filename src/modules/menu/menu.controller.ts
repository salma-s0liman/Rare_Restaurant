import { Router } from "express";
import * as validators from "./menu.validation";
import menuService from "./menu.service";
import { validation } from "../../common";

const router: Router = Router();

// Public Routes - Restaurant & Menu Browsing

// GET /api/restaurants - List all available restaurants
router.get(
  "/restaurants",
  validation({ query: validators.restaurantQueryValidation }),
  menuService.getAllRestaurants
);

// GET /api/restaurants/{id} - Get restaurant details
router.get("/restaurants/:id", menuService.getRestaurantById);

// GET /api/restaurants/{id}/menu - Browse all menu items with categories
router.get(
  "/restaurants/:id/menu",
  validation({ query: validators.menuQueryValidation }),
  menuService.getRestaurantMenu
);

// GET /api/menu-items/{id} - Get detailed menu item information
router.get("/menu-items/:id", menuService.getMenuItemById);

// Admin Routes - Menu Management

// POST /api/admin/restaurants/{restaurant_id}/menu-items - Add new menu item
router.post(
  "/admin/restaurants/:restaurant_id/menu-items",
  validation({ body: validators.createMenuItemValidation }),
  menuService.createMenuItem
);

// PUT /api/admin/menu-items/{id} - Update menu item details
router.put(
  "/admin/menu-items/:id",
  validation({ body: validators.updateMenuItemValidation }),
  menuService.updateMenuItem
);

// DELETE /api/admin/menu-items/{id} - Remove menu item
router.delete("/admin/menu-items/:id", menuService.deleteMenuItem);

// POST /api/admin/restaurants/{restaurant_id}/categories - Create new category
router.post(
  "/admin/restaurants/:restaurant_id/categories",
  validation({ body: validators.createCategoryValidation }),
  menuService.createCategory
);

// POST /api/admin/menu-items/{menu_item_id}/images - Add menu item image
router.post(
  "/admin/menu-items/:menu_item_id/images",
  validation({ body: validators.addMenuItemImageValidation }),
  menuService.addMenuItemImage
);

// DELETE /api/admin/menu-item-images/{image_id} - Remove menu item image
router.delete(
  "/admin/menu-item-images/:image_id",
  menuService.removeMenuItemImage
);

export default router;

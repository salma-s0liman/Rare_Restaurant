import { Router } from "express";
import { validation } from "../../../common/middleware/validation.middleware";
import { RestaurantController } from "../controllers/restaurant.controller";
import { CategoryController } from "../controllers/category.controller";
import { MenuItemController } from "../controllers/menuItem.controller";
import { auth, userRoleEnum } from "../../../common";
import cartController from "../../cart/cart.controller";
import {
  createCategoryValidation,
  createMenuItemImageValidation,
  createMenuItemValidation,
  createRestaurantValidation,
  updateCategoryValidation,
  updateMenuItemValidation,
  updateRestaurantValidation,
} from "../validation";

export const restaurantRoutes = (
  restaurantController: RestaurantController,
  categoryController: CategoryController,
  menuItemController: MenuItemController
) => {
  const router = Router();

  // RESTAURANTS
  router.post(
    "/",
    auth([]),
    validation(createRestaurantValidation),
    restaurantController.createRestaurant
  );
  router.get("/", restaurantController.getAllRestaurants);
  router.get("/:id", restaurantController.getRestaurantById);
  router.put(
    "/:id",
    auth([userRoleEnum.owner]),
    validation(updateRestaurantValidation),
    restaurantController.updateRestaurant
  );
  router.delete(
    "/:id",
    auth([userRoleEnum.owner]),
    restaurantController.deleteRestaurant
  );

  // CATEGORIES
  router.post(
    "/:restaurantId/categories",
    validation(createCategoryValidation),
    categoryController.createCategory
  );
  router.get("/:restaurantId/categories", categoryController.getCategories);
  router.put(
    "/categories/:id",
    validation(updateCategoryValidation),
    categoryController.updateCategory
  );
  router.delete("/categories/:id", categoryController.deleteCategory);

  // MENU ITEMS
  router.post(
    "/:restaurantId/menu-items",
    validation(createMenuItemValidation),
    menuItemController.createMenuItem
  );
  router.get("/:restaurantId/menu-items", menuItemController.getMenuItems);
  router.put(
    "/menu-items/:id",
    validation(updateMenuItemValidation),
    menuItemController.updateMenuItem
  );
  router.delete("/menu-items/:id", menuItemController.deleteMenuItem);

  // MENU ITEM IMAGES
  router.post(
    "/menu-items/:menuItemId/images",
    validation(createMenuItemImageValidation),
    menuItemController.addImage
  );
  router.get("/menu-items/:menuItemId/images", menuItemController.getImages);

  router.use("/:restaurantId/cart", cartController);
  return router;
};

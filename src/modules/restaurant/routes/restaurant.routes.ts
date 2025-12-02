import { Router } from "express";
import { validation } from "../../../common/middleware/validation.middleware";
import { RestaurantController } from "../controllers/restaurant.controller";
import { CategoryController } from "../controllers/category.controller";
import { MenuItemController } from "../controllers/menuItem.controller";
import { auth, userRoleEnum } from "../../../common";
import * as validators from "../validation";

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
    validation(validators.createRestaurantValidation),
    restaurantController.createRestaurant
  );
  router.get("/", restaurantController.getAllRestaurants);
  router.get("/:id", restaurantController.getRestaurantById);
  router.put(
    "/:id",
    auth([userRoleEnum.owner]),
    validation(validators.updateRestaurantValidation),
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
    auth([]),
    validation(validators.createCategoryValidation),
    categoryController.createCategory
  );
  router.get("/:restaurantId/categories", categoryController.getCategories);
  router.put(
    "/categories/:id",
    auth([]),
    validation(validators.updateCategoryValidation),
    categoryController.updateCategory
  );
  router.delete("/categories/:id", auth([]), categoryController.deleteCategory);

  // MENU ITEMS
  router.post(
    "/:restaurantId/menu-items",
    auth([]),
    validation(validators.createMenuItemValidation),
    menuItemController.createMenuItem
  );
  router.get("/:restaurantId/menu-items", menuItemController.getMenuItems);
  router.put(
    "/menu-items/:id",
    auth([]),
    validation(validators.updateMenuItemValidation),
    menuItemController.updateMenuItem
  );
  router.delete("/menu-items/:id", auth([]), menuItemController.deleteMenuItem);

  // MENU ITEM IMAGES
  router.post(
    "/menu-items/:menuItemId/images",
    auth([]),
    validation(validators.createMenuItemImageValidation),
    menuItemController.addImage
  );
  router.get("/menu-items/:menuItemId/images", menuItemController.getImages);
  router.put(
    "/menu-items/images/:imageId",
    auth([]),
    validation(validators.updateMenuItemImageValidation),
    menuItemController.updateImage
  );
  router.delete(
    "/menu-items/images/:imageId",
    auth([]),
    validation(validators.deleteMenuItemImageValidation),
    menuItemController.deleteImage
  );

  return router;
};

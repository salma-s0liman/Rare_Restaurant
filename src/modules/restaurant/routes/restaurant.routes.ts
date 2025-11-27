import { Router } from "express";
import { validation } from "../../../common/middleware/validation.middleware";
import { RestaurantController } from "../controllers/restaurant.controller";
import { CategoryController } from "../controllers/category.controller";
import { MenuItemController } from "../controllers/menuItem.controller";
import * as validators from "../validation/index";

export const restaurantRoutes = (
  restaurantController: RestaurantController,
  categoryController: CategoryController,
  menuItemController: MenuItemController
) => {

  const router = Router();

  // RESTAURANTS
  router.post(
    "/",
    validation(validators.createRestaurantValidation),
    restaurantController.createRestaurant
  );
  router.get(
    "/", 
    restaurantController.getAllRestaurants
  );
  router.get("/:id", restaurantController.getRestaurantById);
  router.put(
    "/:id",
    validation(validators.updateRestaurantValidation),
    restaurantController.updateRestaurant
  );
  router.delete("/:id", restaurantController.deleteRestaurant);

  // CATEGORIES
  router.post(
    "/:restaurantId/categories",
    validation(validators.createCategoryValidation),
    categoryController.createCategory);
  router.get(
    "/:restaurantId/categories", 
    categoryController.getCategories);
  router.put(
    "/categories/:id",
    validation(validators.updateCategoryValidation),
    categoryController.updateCategory);
  router.delete(
    "/categories/:id", 
    categoryController.deleteCategory
  );

  // MENU ITEMS
  router.post(
    "/:restaurantId/menu-items", 
    validation(validators.createMenuItemValidation),
    menuItemController.createMenuItem
  );
  router.get(
    "/:restaurantId/menu-items", 
    menuItemController.getMenuItems
  );
  router.put(
    "/menu-items/:id", 
    validation(validators.updateMenuItemValidation),
    menuItemController.updateMenuItem
  );
  router.delete(
    "/menu-items/:id", 
    menuItemController.deleteMenuItem
  );

  // MENU ITEM IMAGES
  router.post(
    "/menu-items/:menuItemId/images", 
    validation(validators.createMenuItemImageValidation),
    menuItemController.addImage
  );
  router.get(
    "/menu-items/:menuItemId/images", 
    menuItemController.getImages
  );

  return router;
};

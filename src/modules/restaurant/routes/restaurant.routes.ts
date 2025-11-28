import { Router } from "express";
import { validation } from "../../../common/middleware/validation.middleware";
import { RestaurantController } from "../controllers/restaurant.controller";
import { CategoryController } from "../controllers/category.controller";
import { MenuItemController } from "../controllers/menuItem.controller";
<<<<<<< HEAD
import { auth } from "../../../common";
import { userRoleEnum } from "../../../common/enums";

=======
import cartController from "../../cart/cart.controller";
import * as validators from '../validation';
>>>>>>> 32c787ef53cfd737a70c4bc5b25570e7e17d26b5
export const restaurantRoutes = (
  restaurantController: RestaurantController,
  categoryController: CategoryController,
  menuItemController: MenuItemController
) => {
  const router = Router();

  // RESTAURANTS
  router.post(
    "/",
<<<<<<< HEAD
    auth([]),
    restaurantController.createRestaurant
  );
  router.get("/", restaurantController.getAllRestaurants);
  router.get("/:id", restaurantController.getRestaurantById);
  router.put(
    "/:id",
    auth([userRoleEnum.owner]),
    restaurantController.updateRestaurant
  );
  router.delete(
    "/:id",
    auth([userRoleEnum.owner]),
    restaurantController.deleteRestaurant
  );
=======
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
>>>>>>> 32c787ef53cfd737a70c4bc5b25570e7e17d26b5

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


  router.use('/:restaurantId/cart' ,cartController )
  return router;
};

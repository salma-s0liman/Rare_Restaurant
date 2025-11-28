import { Router } from "express";
import { RestaurantController } from "../controllers/restaurant.controller";
import { CategoryController } from "../controllers/category.controller";
import { MenuItemController } from "../controllers/menuItem.controller";
import { auth } from "../../../common";
import { userRoleEnum } from "../../../common/enums";

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

  // CATEGORIES
  router.post("/:restaurantId/categories", categoryController.createCategory);
  router.get("/:restaurantId/categories", categoryController.getCategories);
  router.put("/categories/:id", categoryController.updateCategory);
  router.delete("/categories/:id", categoryController.deleteCategory);

  // MENU ITEMS
  router.post("/:restaurantId/menu-items", menuItemController.createMenuItem);
  router.get("/:restaurantId/menu-items", menuItemController.getMenuItems);
  router.put("/menu-items/:id", menuItemController.updateMenuItem);
  router.delete("/menu-items/:id", menuItemController.deleteMenuItem);

  // MENU ITEM IMAGES
  router.post("/menu-items/:menuItemId/images", menuItemController.addImage);
  router.get("/menu-items/:menuItemId/images", menuItemController.getImages);

  return router;
};

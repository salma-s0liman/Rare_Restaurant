import { Router } from "express";
import { DataSource } from "typeorm";

// ENTITIES
import { Restaurant } from "./../../DB/entity/restaurant";
import { Category } from "./../../DB/entity/category";
import { MenuItem } from "./../../DB/entity/menuItem";
import { MenuItemImage } from "./../../DB/entity/menuItemImage";

// REPOSITORIES
import { RestaurantRepository } from "./repositories/restaurant.repository";
import { CategoryRepository } from "./repositories/category.repository";
import { MenuItemRepository } from "./repositories/menuItem.repository";
import { MenuItemImageRepository } from "./repositories/menuItemImage.repository";

// SERVICES
import { RestaurantService } from "./services/restaurant.service";
import { CategoryService } from "./services/category.service";
import { MenuItemService } from "./services/menuItem.service";

// CONTROLLERS
import { RestaurantController } from "./controllers/restaurant.controller";
import { CategoryController } from "./controllers/category.controller";
import { MenuItemController } from "./controllers/menuItem.controller";

// ROUTES
import { restaurantRoutes } from "./routes/restaurant.routes";

export class RestaurantModule {
  public router: Router;

  constructor(private dataSource: DataSource) {
    // REPOSITORIES
    const restaurantRepo = new RestaurantRepository(this.dataSource.getRepository(Restaurant));
    const categoryRepo = new CategoryRepository(this.dataSource.getRepository(Category));
    const menuItemRepo = new MenuItemRepository(this.dataSource.getRepository(MenuItem));
    const imageRepo = new MenuItemImageRepository(this.dataSource.getRepository(MenuItemImage));

    // SERVICES
    const restaurantService = new RestaurantService(
      restaurantRepo,
      categoryRepo,
    );

    const categoryService = new CategoryService(categoryRepo, restaurantRepo);
    const menuItemService = new MenuItemService(menuItemRepo, imageRepo, restaurantRepo, categoryRepo);

    // CONTROLLERS
    const restaurantController = new RestaurantController(restaurantService);
    const categoryController = new CategoryController(categoryService);
    const menuItemController = new MenuItemController(menuItemService);

    // ROUTER
    this.router = restaurantRoutes(
      restaurantController,
      categoryController,
      menuItemController
    );
  }
}

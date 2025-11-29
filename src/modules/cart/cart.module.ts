// src/modules/cart/cart.module.ts
import { Router } from "express";
import { DataSource, Repository } from "typeorm";

import { Cart } from "../../DB/entity/cart";
import { CartItem } from "../../DB/entity/cartItems";
import { Restaurant } from "../../DB/entity/restaurant";
import { MenuItem } from "../../DB/entity/menuItem";

import { CartRepository } from "./repositories/cart.repository";
import { CartItemRepository } from "./repositories/cartItem.repository";

import { CartService } from "./services/cart.service";
import { CartItemService } from "./services/cartItem.service";

import { CartController } from "./controllers/cart.controller";
import { CartItemController } from "./controllers/cartItem.controller";

import { createCartRouter } from "./routes/cart.routes";
import { createCartItemRouter } from "./routes/cartItem.routes";

export function CartModule(dataSource: DataSource): Router {
  const cartRepo: Repository<Cart> = dataSource.getRepository(Cart);
  const cartItemRepo: Repository<CartItem> = dataSource.getRepository(CartItem);
  const restaurantRepo: Repository<Restaurant> = dataSource.getRepository(Restaurant);
  const menuRepo: Repository<MenuItem> = dataSource.getRepository(MenuItem);

  const cartRepository = new CartRepository(cartRepo);
  const cartItemRepository = new CartItemRepository(cartItemRepo);

  // Services
  const cartService = new CartService(cartRepository, restaurantRepo);
  const cartItemService = new CartItemService(cartItemRepository, cartRepository, menuRepo);

  // Controllers
  const cartController = new CartController(cartService);
  const cartItemController = new CartItemController(cartItemService);

  // Routers
  const router = Router();

  // Mount sub-routers
  router.use("/", createCartRouter(cartController));
  router.use("/", createCartItemRouter(cartItemController));

  return router;
}

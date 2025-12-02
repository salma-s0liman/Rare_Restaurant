// src/modules/cart/routes/cart.routes.ts
import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { validation } from "../../../common/middleware/validation.middleware"; // your zod middleware adaptor
import { auth } from "../../../common/middleware/auth.middleware";
import * as validators from "../validators/cart.validation";

export function createCartRouter(cartController: CartController) {
  const router = Router();

  // create cart for restaurant (authenticated required)
  router.post(
    "/restaurants/:restaurantId/carts",
    auth([]),
    validation(validators.createCart),
    cartController.createCart
  );

  // get cart by id
  router.get(
    "/carts/:cartId",
    auth([]),
    validation(validators.getCart),
    cartController.getCart
  );

  // delete cart
  router.delete(
    "/carts/:cartId",
    auth([]),
    validation(validators.deleteCart),
    cartController.deleteCart
  );

  return router;
}

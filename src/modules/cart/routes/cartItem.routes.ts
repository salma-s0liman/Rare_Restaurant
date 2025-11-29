// src/modules/cart/routes/cartItem.routes.ts
import { Router } from "express";
import { CartItemController } from "../controllers/cartItem.controller";
import { validation } from "../../../common/middleware/validation.middleware";
import * as validators from "../validators/cartItem.validation";

export function createCartItemRouter(cartItemController: CartItemController) {
  const router = Router();

  // add item to cart
  router.post(
    "/carts/:cartId/items",
    validation(validators.addCartItem),
    cartItemController.addItem
  );

  // update cart item
  router.patch(
    "/cart-items/:cartItemId",
    validation(validators.updateCartItem),
    cartItemController.updateItem
  );

  // delete cart item
  router.delete(
    "/cart-items/:cartItemId",
    validation(validators.deleteCartItem),
    cartItemController.deleteItem
  );

  return router;
}

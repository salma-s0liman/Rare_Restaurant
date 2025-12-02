// src/modules/cart/routes/cartItem.routes.ts
import { Router } from "express";
import { CartItemController } from "../controllers/cartItem.controller";
import { validation } from "../../../common/middleware/validation.middleware";
import * as validators from "../validators/cartItem.validation";
import { auth } from "../../../common";

export function createCartItemRouter(cartItemController: CartItemController) {
  const router = Router();

  /**
   * @swagger
   * /carts/{cartId}/items:
   *   post:
   *     tags:
   *       - Cart
   *     summary: Add item to cart
   *     description: Add a menu item to the shopping cart
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: cartId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174005"
   *         description: Cart unique identifier
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CartItemAdd'
   *           examples:
   *             pizza_item:
   *               summary: Add pizza to cart
   *               value:
   *                 menuItemId: "123e4567-e89b-12d3-a456-426614174007"
   *                 quantity: 2
   *                 specialInstructions: "Extra cheese, no onions"
   *             salad_item:
   *               summary: Add salad to cart
   *               value:
   *                 menuItemId: "123e4567-e89b-12d3-a456-426614174009"
   *                 quantity: 1
   *                 specialInstructions: "Dressing on the side"
   *             simple_item:
   *               summary: Add item without special instructions
   *               value:
   *                 menuItemId: "123e4567-e89b-12d3-a456-426614174010"
   *                 quantity: 3
   *     responses:
   *       '201':
   *         description: Item added to cart successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Cart'
   *             example:
   *               success: true
   *               message: "Item added to cart successfully"
   *               data:
   *                 id: "123e4567-e89b-12d3-a456-426614174005"
   *                 totalItems: 2
   *                 subtotal: 29.98
   *                 items:
   *                   - id: "123e4567-e89b-12d3-a456-426614174006"
   *                     quantity: 2
   *                     price: 14.99
   *                     subtotal: 29.98
   *                     specialInstructions: "Extra cheese, no onions"
   *                     menuItem:
   *                       name: "Margherita Pizza"
   *                       price: 14.99
   *       '400':
   *         description: Validation error or item constraints
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             examples:
   *               validation_error:
   *                 summary: Invalid request data
   *                 value:
   *                   success: false
   *                   message: "Validation failed"
   *                   errors: [
   *                     "Menu item ID is required",
   *                     "Quantity must be at least 1"
   *                   ]
   *               different_restaurant:
   *                 summary: Menu item from different restaurant
   *                 value:
   *                   success: false
   *                   message: "Cannot add items from different restaurants to the same cart"
   *               item_unavailable:
   *                 summary: Menu item not available
   *                 value:
   *                   success: false
   *                   message: "This menu item is currently not available"
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Cart or menu item not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  // add item to cart
  router.post(
    "/carts/:cartId/items",
    auth([]),
    validation(validators.addCartItem),
    cartItemController.addItem
  );

  /**
   * @swagger
   * /cart-items/{cartItemId}:
   *   patch:
   *     tags:
   *       - Cart
   *     summary: Update cart item
   *     description: Update quantity or special instructions for a cart item
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: cartItemId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174006"
   *         description: Cart item unique identifier
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               quantity:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 99
   *                 example: 3
   *                 description: Updated quantity
   *               specialInstructions:
   *                 type: string
   *                 maxLength: 500
   *                 example: "Extra cheese, well done, no onions"
   *                 description: Updated special instructions
   *           examples:
   *             update_quantity:
   *               summary: Update quantity
   *               value:
   *                 quantity: 3
   *             update_instructions:
   *               summary: Update special instructions
   *               value:
   *                 specialInstructions: "Extra cheese, well done"
   *             update_both:
   *               summary: Update both quantity and instructions
   *               value:
   *                 quantity: 2
   *                 specialInstructions: "Light sauce, extra cheese"
   *     responses:
   *       '200':
   *         description: Cart item updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Cart'
   *             example:
   *               success: true
   *               message: "Cart item updated successfully"
   *               data:
   *                 id: "123e4567-e89b-12d3-a456-426614174005"
   *                 totalItems: 3
   *                 subtotal: 44.97
   *                 items:
   *                   - id: "123e4567-e89b-12d3-a456-426614174006"
   *                     quantity: 3
   *                     price: 14.99
   *                     subtotal: 44.97
   *                     specialInstructions: "Extra cheese, well done"
   *       '400':
   *         description: Validation error
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Forbidden - Not your cart item
   *       '404':
   *         description: Cart item not found
   */
  // update cart item
  router.patch(
    "/cart-items/:cartItemId",
    auth([]),
    validation(validators.updateCartItem),
    cartItemController.updateItem
  );

  /**
   * @swagger
   * /cart-items/{cartItemId}:
   *   delete:
   *     tags:
   *       - Cart
   *     summary: Remove item from cart
   *     description: Remove a specific item from the cart
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: cartItemId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174006"
   *         description: Cart item unique identifier
   *     responses:
   *       '200':
   *         description: Item removed from cart successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Cart'
   *             example:
   *               success: true
   *               message: "Item removed from cart successfully"
   *               data:
   *                 id: "123e4567-e89b-12d3-a456-426614174005"
   *                 totalItems: 0
   *                 subtotal: 0.00
   *                 items: []
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Forbidden - Not your cart item
   *       '404':
   *         description: Cart item not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               success: false
   *               message: "Cart item not found"
   */
  // delete cart item
  router.delete(
    "/cart-items/:cartItemId",
    auth([]),
    validation(validators.deleteCartItem),
    cartItemController.deleteItem
  );

  return router;
}

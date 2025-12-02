// src/modules/cart/routes/cart.routes.ts
import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { validation } from "../../../common/middleware/validation.middleware"; // your zod middleware adaptor
import { auth } from "../../../common/middleware/auth.middleware";
import * as validators from "../validators/cart.validation";

export function createCartRouter(cartController: CartController) {
  const router = Router();

  /**
   * @swagger
   * /restaurants/{restaurantId}/carts:
   *   post:
   *     tags:
   *       - Cart
   *     summary: Create a new cart
   *     description: Create a new shopping cart for a specific restaurant
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: restaurantId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174001"
   *         description: Restaurant ID to create cart for
   *     responses:
   *       '201':
   *         description: Cart created successfully
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
   *               message: "Cart created successfully"
   *               data:
   *                 id: "123e4567-e89b-12d3-a456-426614174005"
   *                 userId: "123e4567-e89b-12d3-a456-426614174000"
   *                 restaurantId: "123e4567-e89b-12d3-a456-426614174001"
   *                 totalItems: 0
   *                 subtotal: 0.00
   *                 items: []
   *                 createdAt: "2024-01-15T10:30:00.000Z"
   *                 updatedAt: "2024-01-15T10:30:00.000Z"
   *       '400':
   *         description: Validation error or cart already exists for this restaurant
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             examples:
   *               existing_cart:
   *                 summary: Cart already exists
   *                 value:
   *                   success: false
   *                   message: "You already have an active cart for this restaurant. Please use the existing cart or clear it first."
   *               restaurant_not_found:
   *                 summary: Restaurant not found
   *                 value:
   *                   success: false
   *                   message: "Restaurant not found or not active"
   *       '401':
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  // create cart for restaurant (authenticated required)
  router.post(
    "/restaurants/:restaurantId/carts",
    auth([]),
    validation(validators.createCart),
    cartController.createCart
  );

  /**
   * @swagger
   * /carts/{cartId}:
   *   get:
   *     tags:
   *       - Cart
   *     summary: Get cart details
   *     description: Retrieve cart information with all items
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
   *     responses:
   *       '200':
   *         description: Cart details retrieved successfully
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
   *               message: "Cart retrieved successfully"
   *               data:
   *                 id: "123e4567-e89b-12d3-a456-426614174005"
   *                 userId: "123e4567-e89b-12d3-a456-426614174000"
   *                 restaurantId: "123e4567-e89b-12d3-a456-426614174001"
   *                 totalItems: 3
   *                 subtotal: 42.97
   *                 items:
   *                   - id: "123e4567-e89b-12d3-a456-426614174006"
   *                     quantity: 2
   *                     price: 14.99
   *                     subtotal: 29.98
   *                     specialInstructions: "Extra cheese"
   *                     menuItem:
   *                       id: "123e4567-e89b-12d3-a456-426614174007"
   *                       name: "Margherita Pizza"
   *                       description: "Classic pizza with fresh ingredients"
   *                       price: 14.99
   *                   - id: "123e4567-e89b-12d3-a456-426614174008"
   *                     quantity: 1
   *                     price: 12.99
   *                     subtotal: 12.99
   *                     specialInstructions: null
   *                     menuItem:
   *                       id: "123e4567-e89b-12d3-a456-426614174009"
   *                       name: "Caesar Salad"
   *                       description: "Fresh romaine lettuce with Caesar dressing"
   *                       price: 12.99
   *                 createdAt: "2024-01-15T10:30:00.000Z"
   *                 updatedAt: "2024-01-15T11:15:00.000Z"
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Forbidden - Not your cart
   *       '404':
   *         description: Cart not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               success: false
   *               message: "Cart not found"
   */
  // get cart by id
  router.get(
    "/carts/:cartId",
    auth([]),
    validation(validators.getCart),
    cartController.getCart
  );

  /**
   * @swagger
   * /carts/{cartId}:
   *   delete:
   *     tags:
   *       - Cart
   *     summary: Delete cart
   *     description: Delete cart and all its items
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
   *     responses:
   *       '200':
   *         description: Cart deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *             example:
   *               success: true
   *               message: "Cart deleted successfully"
   *               data: {}
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Forbidden - Not your cart
   *       '404':
   *         description: Cart not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  // delete cart
  router.delete(
    "/carts/:cartId",
    auth([]),
    validation(validators.deleteCart),
    cartController.deleteCart
  );

  return router;
}

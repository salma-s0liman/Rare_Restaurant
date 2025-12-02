import { Router } from "express";
import { OrderItemController } from "../controllers/orderItem.controller";
import { auth } from "../../../common/middleware/auth.middleware";
import { userRoleEnum } from "../../../common/enums";

export function createOrderItemRouter(orderItemController: OrderItemController): Router {
  const router = Router();

  /**
   * @swagger
   * /orders/{orderId}/items:
   *   get:
   *     tags:
   *       - Order Items
   *     summary: Get order items
   *     description: Get all items for a specific order. Customers can only view items from their own orders.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Order ID
   *         example: "123e4567-e89b-12d3-a456-426614174002"
   *     responses:
   *       '200':
   *         description: Order items retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         allOf:
   *                           - $ref: '#/components/schemas/OrderItem'
   *                           - type: object
   *                             properties:
   *                               menuItem:
   *                                 $ref: '#/components/schemas/MenuItem'
   *             example:
   *               success: true
   *               message: "Order items retrieved successfully"
   *               data:
   *                 - id: "item-001"
   *                   quantity: 2
   *                   unitPrice: 12.99
   *                   totalPrice: 25.98
   *                   notes: "Extra cheese, no onions"
   *                   menuItem:
   *                     id: "menu-001"
   *                     name: "Margherita Pizza"
   *                     description: "Fresh tomatoes, mozzarella, basil"
   *                     price: 12.99
   *                     imageUrl: "https://example.com/pizza.jpg"
   *                 - id: "item-002"
   *                   quantity: 1
   *                   unitPrice: 8.50
   *                   totalPrice: 8.50
   *                   notes: ""
   *                   menuItem:
   *                     id: "menu-002"
   *                     name: "Caesar Salad"
   *                     description: "Crisp romaine lettuce with caesar dressing"
   *                     price: 8.50
   *                     imageUrl: "https://example.com/salad.jpg"
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Not authorized to view this order's items
   *       '404':
   *         description: Order not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get(
    "/:orderId/items", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    orderItemController.getOrderItems
  );

  /**
   * @swagger
   * /orders/order-items/{itemId}:
   *   get:
   *     tags:
   *       - Order Items
   *     summary: Get order item by ID
   *     description: Get detailed information about a specific order item
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: itemId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Order item ID
   *         example: "item-001"
   *     responses:
   *       '200':
   *         description: Order item retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       allOf:
   *                         - $ref: '#/components/schemas/OrderItem'
   *                         - type: object
   *                           properties:
   *                             menuItem:
   *                               $ref: '#/components/schemas/MenuItem'
   *                             order:
   *                               type: object
   *                               properties:
   *                                 id:
   *                                   type: string
   *                                   format: uuid
   *                                 orderNumber:
   *                                   type: string
   *                                 status:
   *                                   type: string
   *             example:
   *               success: true
   *               message: "Order item retrieved successfully"
   *               data:
   *                 id: "item-001"
   *                 quantity: 2
   *                 unitPrice: 12.99
   *                 totalPrice: 25.98
   *                 notes: "Extra cheese, no onions"
   *                 createdAt: "2024-01-15T18:30:00.000Z"
   *                 menuItem:
   *                   id: "menu-001"
   *                   name: "Margherita Pizza"
   *                   description: "Fresh tomatoes, mozzarella, basil"
   *                   price: 12.99
   *                   category:
   *                     name: "Pizza"
   *                 order:
   *                   id: "123e4567-e89b-12d3-a456-426614174002"
   *                   orderNumber: "ORD-2024-001"
   *                   status: "delivered"
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Not authorized to view this order item
   *       '404':
   *         description: Order item not found
   */
  router.get(
    "/order-items/:itemId", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    orderItemController.getOrderItemById
  );

  /**
   * @swagger
   * /orders/{orderId}/total:
   *   get:
   *     tags:
   *       - Order Items
   *     summary: Calculate order total
   *     description: Calculate the total cost of all items in an order including tax, delivery fees, etc.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Order ID
   *         example: "123e4567-e89b-12d3-a456-426614174002"
   *       - in: query
   *         name: includeBreakdown
   *         schema:
   *           type: boolean
   *           default: false
   *         description: Include detailed price breakdown
   *     responses:
   *       '200':
   *         description: Order total calculated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         orderId:
   *                           type: string
   *                           format: uuid
   *                         subtotal:
   *                           type: number
   *                           format: float
   *                           description: Sum of all item prices
   *                         tax:
   *                           type: number
   *                           format: float
   *                           description: Tax amount
   *                         deliveryFee:
   *                           type: number
   *                           format: float
   *                           description: Delivery fee (if applicable)
   *                         serviceCharge:
   *                           type: number
   *                           format: float
   *                           description: Service charge
   *                         discountAmount:
   *                           type: number
   *                           format: float
   *                           description: Total discount applied
   *                         total:
   *                           type: number
   *                           format: float
   *                           description: Final total amount
   *                         breakdown:
   *                           type: array
   *                           items:
   *                             type: object
   *                             properties:
   *                               itemName:
   *                                 type: string
   *                               quantity:
   *                                 type: integer
   *                               unitPrice:
   *                                 type: number
   *                               totalPrice:
   *                                 type: number
   *             example:
   *               success: true
   *               message: "Order total calculated successfully"
   *               data:
   *                 orderId: "123e4567-e89b-12d3-a456-426614174002"
   *                 subtotal: 34.48
   *                 tax: 2.76
   *                 deliveryFee: 2.49
   *                 serviceCharge: 1.72
   *                 discountAmount: 5.00
   *                 total: 36.45
   *                 breakdown:
   *                   - itemName: "Margherita Pizza"
   *                     quantity: 2
   *                     unitPrice: 12.99
   *                     totalPrice: 25.98
   *                   - itemName: "Caesar Salad"
   *                     quantity: 1
   *                     unitPrice: 8.50
   *                     totalPrice: 8.50
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Not authorized to view this order
   *       '404':
   *         description: Order not found
   */
  router.get(
    "/:orderId/total", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    orderItemController.calculateOrderTotal
  );

  return router;
}
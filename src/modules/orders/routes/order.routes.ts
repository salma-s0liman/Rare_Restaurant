import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { auth } from "../../../common/middleware/auth.middleware";
import { validation } from "../../../common/middleware/validation.middleware";
import { userRoleEnum } from "../../../common/enums";
import * as validators from "../validation";

export function createOrderRouter(orderController: OrderController): Router {
  const router = Router();

  /**
   * @swagger
   * /orders:
   *   post:
   *     tags:
   *       - Orders
   *     summary: Create new order
   *     description: Create a new order from cart items. Only customers can create orders.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/OrderInput'
   *           examples:
   *             delivery_order:
   *               summary: Delivery order
   *               value:
   *                 cartId: "123e4567-e89b-12d3-a456-426614174000"
   *                 deliveryAddressId: "123e4567-e89b-12d3-a456-426614174001"
   *                 paymentMethod: "credit_card"
   *                 notes: "Please ring the doorbell"
   *                 orderType: "delivery"
   *             pickup_order:
   *               summary: Pickup order
   *               value:
   *                 cartId: "123e4567-e89b-12d3-a456-426614174000"
   *                 paymentMethod: "cash"
   *                 notes: "Will pick up at 7 PM"
   *                 orderType: "pickup"
   *     responses:
   *       '201':
   *         description: Order created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Order'
   *             example:
   *               success: true
   *               message: "Order created successfully"
   *               data:
   *                 id: "123e4567-e89b-12d3-a456-426614174002"
   *                 orderNumber: "ORD-2024-001"
   *                 status: "pending"
   *                 total: 45.67
   *                 subtotal: 39.98
   *                 tax: 3.20
   *                 deliveryFee: 2.49
   *                 orderType: "delivery"
   *                 paymentMethod: "credit_card"
   *                 notes: "Please ring the doorbell"
   *                 estimatedDeliveryTime: "2024-01-15T19:30:00.000Z"
   *                 createdAt: "2024-01-15T18:30:00.000Z"
   *       '400':
   *         description: Validation error or cart issues
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             examples:
   *               empty_cart:
   *                 summary: Empty cart
   *                 value:
   *                   success: false
   *                   message: "Cannot create order from empty cart"
   *               invalid_payment:
   *                 summary: Invalid payment method
   *                 value:
   *                   success: false
   *                   message: "Invalid payment method"
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Only customers can create orders
   */
  router.post(
    "/", 
    auth([userRoleEnum.customer]),
    validation(validators.createOrderValidation),
    orderController.createOrder
  );

  /**
   * @swagger
   * /orders/my-orders:
   *   get:
   *     tags:
   *       - Orders
   *     summary: Get user's orders
   *     description: Get all orders for the authenticated customer with pagination
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Number of orders per page
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, confirmed, preparing, ready, out_for_delivery, delivered, cancelled]
   *         description: Filter by order status
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [createdAt, total, status]
   *           default: createdAt
   *         description: Field to sort by
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: desc
   *         description: Sort order
   *     responses:
   *       '200':
   *         description: Orders retrieved successfully
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
   *                         orders:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/Order'
   *                         pagination:
   *                           $ref: '#/components/schemas/Pagination'
   *             example:
   *               success: true
   *               message: "Orders retrieved successfully"
   *               data:
   *                 orders:
   *                   - id: "123e4567-e89b-12d3-a456-426614174002"
   *                     orderNumber: "ORD-2024-001"
   *                     status: "delivered"
   *                     total: 45.67
   *                     orderType: "delivery"
   *                     createdAt: "2024-01-15T18:30:00.000Z"
   *                     deliveredAt: "2024-01-15T19:45:00.000Z"
   *                   - id: "123e4567-e89b-12d3-a456-426614174003"
   *                     orderNumber: "ORD-2024-002"
   *                     status: "preparing"
   *                     total: 32.45
   *                     orderType: "pickup"
   *                     createdAt: "2024-01-16T12:15:00.000Z"
   *                 pagination:
   *                   page: 1
   *                   limit: 10
   *                   total: 15
   *                   totalPages: 2
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Only customers can access their orders
   */
  router.get(
    "/my-orders", 
    auth([userRoleEnum.customer]),
    validation(validators.getUserOrdersValidation),
    orderController.getUserOrders
  );

  /**
   * @swagger
   * /orders/{orderId}:
   *   get:
   *     tags:
   *       - Orders
   *     summary: Get order details
   *     description: Get detailed information about a specific order. Customers can only view their own orders, admins can view any order.
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
   *         description: Order details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       allOf:
   *                         - $ref: '#/components/schemas/Order'
   *                         - type: object
   *                           properties:
   *                             items:
   *                               type: array
   *                               items:
   *                                 $ref: '#/components/schemas/OrderItem'
   *                             restaurant:
   *                               $ref: '#/components/schemas/Restaurant'
   *                             customer:
   *                               $ref: '#/components/schemas/User'
   *                             address:
   *                               $ref: '#/components/schemas/Address'
   *                             statusHistory:
   *                               type: array
   *                               items:
   *                                 $ref: '#/components/schemas/OrderStatusHistory'
   *             example:
   *               success: true
   *               message: "Order details retrieved successfully"
   *               data:
   *                 id: "123e4567-e89b-12d3-a456-426614174002"
   *                 orderNumber: "ORD-2024-001"
   *                 status: "delivered"
   *                 total: 45.67
   *                 subtotal: 39.98
   *                 tax: 3.20
   *                 deliveryFee: 2.49
   *                 orderType: "delivery"
   *                 paymentMethod: "credit_card"
   *                 notes: "Please ring the doorbell"
   *                 estimatedDeliveryTime: "2024-01-15T19:30:00.000Z"
   *                 deliveredAt: "2024-01-15T19:45:00.000Z"
   *                 items:
   *                   - id: "item-001"
   *                     quantity: 2
   *                     unitPrice: 12.99
   *                     totalPrice: 25.98
   *                     menuItem:
   *                       name: "Margherita Pizza"
   *                       description: "Fresh tomatoes, mozzarella, basil"
   *                 restaurant:
   *                   id: "rest-001"
   *                   name: "Mario's Pizza Palace"
   *                   phone: "+1234567890"
   *                 customer:
   *                   id: "user-001"
   *                   firstName: "John"
   *                   lastName: "Doe"
   *                   email: "john.doe@example.com"
   *                 address:
   *                   street: "123 Main Street"
   *                   city: "New York"
   *                   zipCode: "10001"
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Not authorized to view this order
   *       '404':
   *         description: Order not found
   */
  router.get(
    "/:orderId", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    validation(validators.getOrderDetailValidation),
    orderController.getOrderDetail
  );

  /**
   * @swagger
   * /orders/number/{orderNumber}:
   *   get:
   *     tags:
   *       - Orders
   *       - Admin
   *     summary: Get order by number (Admin only)
   *     description: Get order details by order number. Requires admin, owner, or manager role.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderNumber
   *         required: true
   *         schema:
   *           type: string
   *         description: Order number
   *         example: "ORD-2024-001"
   *     responses:
   *       '200':
   *         description: Order retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Order'
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Insufficient permissions
   *       '404':
   *         description: Order not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               success: false
   *               message: "Order not found with number: ORD-2024-001"
   */
  router.get(
    "/number/:orderNumber", 
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    validation(validators.getOrderByNumberValidation),
    orderController.getOrderByNumber
  );

  /**
   * @swagger
   * /orders/{orderId}/status:
   *   patch:
   *     tags:
   *       - Orders
   *       - Admin
   *     summary: Update order status (Admin only)
   *     description: Update the status of an order. Requires admin, owner, or manager role.
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
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - status
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [pending, confirmed, preparing, ready, out_for_delivery, delivered, cancelled]
   *                 example: "preparing"
   *                 description: New order status
   *               notes:
   *                 type: string
   *                 maxLength: 500
   *                 example: "Order confirmed, estimated preparation time: 25 minutes"
   *                 description: Optional notes about the status change
   *               estimatedTime:
   *                 type: string
   *                 format: date-time
   *                 example: "2024-01-15T19:30:00.000Z"
   *                 description: Estimated completion time (for ready/delivery statuses)
   *           examples:
   *             confirm_order:
   *               summary: Confirm order
   *               value:
   *                 status: "confirmed"
   *                 notes: "Order confirmed, estimated preparation time: 25 minutes"
   *                 estimatedTime: "2024-01-15T19:30:00.000Z"
   *             start_preparing:
   *               summary: Start preparing
   *               value:
   *                 status: "preparing"
   *                 notes: "Kitchen has started preparing your order"
   *             order_ready:
   *               summary: Order ready
   *               value:
   *                 status: "ready"
   *                 notes: "Order is ready for pickup/delivery"
   *             out_for_delivery:
   *               summary: Out for delivery
   *               value:
   *                 status: "out_for_delivery"
   *                 notes: "Order is on the way"
   *                 estimatedTime: "2024-01-15T20:00:00.000Z"
   *             delivered:
   *               summary: Order delivered
   *               value:
   *                 status: "delivered"
   *                 notes: "Order successfully delivered"
   *             cancel_order:
   *               summary: Cancel order
   *               value:
   *                 status: "cancelled"
   *                 notes: "Order cancelled due to ingredient unavailability"
   *     responses:
   *       '200':
   *         description: Order status updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Order'
   *             example:
   *               success: true
   *               message: "Order status updated successfully"
   *               data:
   *                 id: "123e4567-e89b-12d3-a456-426614174002"
   *                 orderNumber: "ORD-2024-001"
   *                 status: "preparing"
   *                 estimatedDeliveryTime: "2024-01-15T19:30:00.000Z"
   *                 updatedAt: "2024-01-15T18:45:00.000Z"
   *       '400':
   *         description: Invalid status transition
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             examples:
   *               invalid_transition:
   *                 summary: Invalid status transition
   *                 value:
   *                   success: false
   *                   message: "Cannot change status from 'delivered' to 'preparing'"
   *               invalid_status:
   *                 summary: Invalid status
   *                 value:
   *                   success: false
   *                   message: "Invalid order status"
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Insufficient permissions
   *       '404':
   *         description: Order not found
   */
  router.patch(
    "/:orderId/status", 
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    validation(validators.updateOrderStatusValidation),
    orderController.updateOrderStatus
  );

  return router;
}
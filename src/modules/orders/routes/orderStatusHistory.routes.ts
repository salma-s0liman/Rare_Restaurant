import { Router } from "express";
import { OrderStatusHistoryController } from "../controllers/orderStatusHistory.controller";
import { auth } from "../../../common/middleware/auth.middleware";
import { userRoleEnum } from "../../../common/enums";

export function createOrderStatusHistoryRouter(statusHistoryController: OrderStatusHistoryController): Router {
  const router = Router();

  /**
   * @swagger
   * /orders/{orderId}/status-history:
   *   get:
   *     tags:
   *       - Order Status
   *     summary: Get order status history
   *     description: Get complete status history for a specific order showing all status changes over time. Customers can only view history for their own orders.
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
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: asc
   *         description: Sort order by timestamp (asc = oldest first, desc = newest first)
   *     responses:
   *       '200':
   *         description: Order status history retrieved successfully
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
   *                         orderNumber:
   *                           type: string
   *                         currentStatus:
   *                           type: string
   *                           enum: [pending, confirmed, preparing, ready, out_for_delivery, delivered, cancelled]
   *                         statusHistory:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/OrderStatusHistory'
   *             example:
   *               success: true
   *               message: "Order status history retrieved successfully"
   *               data:
   *                 orderId: "123e4567-e89b-12d3-a456-426614174002"
   *                 orderNumber: "ORD-2024-001"
   *                 currentStatus: "delivered"
   *                 statusHistory:
   *                   - id: "status-001"
   *                     status: "pending"
   *                     notes: "Order placed by customer"
   *                     timestamp: "2024-01-15T18:30:00.000Z"
   *                     updatedBy:
   *                       id: "user-001"
   *                       name: "John Doe"
   *                       role: "customer"
   *                   - id: "status-002"
   *                     status: "confirmed"
   *                     notes: "Order confirmed by restaurant"
   *                     timestamp: "2024-01-15T18:32:00.000Z"
   *                     updatedBy:
   *                       id: "admin-001"
   *                       name: "Restaurant Manager"
   *                       role: "manager"
   *                   - id: "status-003"
   *                     status: "preparing"
   *                     notes: "Kitchen started preparing order"
   *                     timestamp: "2024-01-15T18:35:00.000Z"
   *                     updatedBy:
   *                       id: "admin-001"
   *                       name: "Restaurant Manager"
   *                       role: "manager"
   *                   - id: "status-004"
   *                     status: "ready"
   *                     notes: "Order ready for delivery"
   *                     timestamp: "2024-01-15T19:05:00.000Z"
   *                     updatedBy:
   *                       id: "admin-001"
   *                       name: "Restaurant Manager"
   *                       role: "manager"
   *                   - id: "status-005"
   *                     status: "out_for_delivery"
   *                     notes: "Order picked up by delivery driver"
   *                     timestamp: "2024-01-15T19:10:00.000Z"
   *                     updatedBy:
   *                       id: "driver-001"
   *                       name: "Delivery Driver"
   *                       role: "driver"
   *                   - id: "status-006"
   *                     status: "delivered"
   *                     notes: "Order successfully delivered to customer"
   *                     timestamp: "2024-01-15T19:45:00.000Z"
   *                     updatedBy:
   *                       id: "driver-001"
   *                       name: "Delivery Driver"
   *                       role: "driver"
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Not authorized to view this order's status history
   *       '404':
   *         description: Order not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get(
    "/:orderId/status-history", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    statusHistoryController.getOrderStatusHistory
  );

  /**
   * @swagger
   * /orders/{orderId}/latest-status:
   *   get:
   *     tags:
   *       - Order Status
   *     summary: Get latest order status
   *     description: Get the most recent status update for a specific order. Useful for real-time order tracking.
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
   *         description: Latest order status retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       allOf:
   *                         - $ref: '#/components/schemas/OrderStatusHistory'
   *                         - type: object
   *                           properties:
   *                             order:
   *                               type: object
   *                               properties:
   *                                 id:
   *                                   type: string
   *                                   format: uuid
   *                                 orderNumber:
   *                                   type: string
   *                                 estimatedDeliveryTime:
   *                                   type: string
   *                                   format: date-time
   *                             updatedBy:
   *                               type: object
   *                               properties:
   *                                 id:
   *                                   type: string
   *                                 name:
   *                                   type: string
   *                                 role:
   *                                   type: string
   *             example:
   *               success: true
   *               message: "Latest order status retrieved successfully"
   *               data:
   *                 id: "status-006"
   *                 status: "delivered"
   *                 notes: "Order successfully delivered to customer at front door"
   *                 timestamp: "2024-01-15T19:45:00.000Z"
   *                 estimatedNextUpdate: null
   *                 order:
   *                   id: "123e4567-e89b-12d3-a456-426614174002"
   *                   orderNumber: "ORD-2024-001"
   *                   estimatedDeliveryTime: "2024-01-15T19:30:00.000Z"
   *                 updatedBy:
   *                   id: "driver-001"
   *                   name: "Delivery Driver"
   *                   role: "driver"
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Not authorized to view this order's status
   *       '404':
   *         description: Order not found or no status history available
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             examples:
   *               order_not_found:
   *                 summary: Order not found
   *                 value:
   *                   success: false
   *                   message: "Order not found"
   *               no_status_history:
   *                 summary: No status history available
   *                 value:
   *                   success: false
   *                   message: "No status history available for this order"
   */
  router.get(
    "/:orderId/latest-status", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    statusHistoryController.getLatestStatus
  );

  return router;
}
import { Router } from "express";
import { OrderItemController } from "../controllers/orderItem.controller";
import { auth } from "../../../common/middleware/auth.middleware";
import { userRoleEnum } from "../../../common/enums";

/**
 * Create order item routes
 */
export function createOrderItemRouter(orderItemController: OrderItemController): Router {
  const router = Router();

  /**
   * @route GET /orders/:orderId/items
   * @desc Get order items
   * @access Private
   */
  router.get(
    "/:orderId/items", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    orderItemController.getOrderItems
  );

  /**
   * @route GET /order-items/:itemId
   * @desc Get order item by ID
   * @access Private
   */
  router.get(
    "/order-items/:itemId", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    orderItemController.getOrderItemById
  );

  /**
   * @route GET /orders/:orderId/total
   * @desc Calculate order total
   * @access Private
   */
  router.get(
    "/:orderId/total", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    orderItemController.calculateOrderTotal
  );

  return router;
}
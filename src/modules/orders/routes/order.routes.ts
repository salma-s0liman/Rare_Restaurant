import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { auth } from "../../../common/middleware/auth.middleware";
import { validation } from "../../../common/middleware/validation.middleware";
import { userRoleEnum } from "../../../common/enums";
import * as validators from "../validation";

/**
 * Create order routes
 */
export function createOrderRouter(orderController: OrderController): Router {
  const router = Router();

  /**
   * @route POST /orders
   * @desc Create order from cart
   * @access Private (Customer)
   */
  router.post(
    "/", 
    auth([userRoleEnum.customer]),
    validation(validators.createOrderValidation),
    orderController.createOrder
  );

  /**
   * @route GET /orders/my-orders
   * @desc Get user orders
   * @access Private (Customer)
   */
  router.get(
    "/my-orders", 
    auth([userRoleEnum.customer]),
    validation(validators.getUserOrdersValidation),
    orderController.getUserOrders
  );

  /**
   * @route GET /orders/:orderId
   * @desc Get order details
   * @access Private (Customer/Admin)
   */
  router.get(
    "/:orderId", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    validation(validators.getOrderDetailValidation),
    orderController.getOrderDetail
  );

  /**
   * @route GET /orders/number/:orderNumber
   * @desc Get order by number
   * @access Private (Admin)
   */
  router.get(
    "/number/:orderNumber", 
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    validation(validators.getOrderByNumberValidation),
    orderController.getOrderByNumber
  );

  /**
   * @route PATCH /orders/:orderId/status
   * @desc Update order status
   * @access Private (Admin)
   */
  router.patch(
    "/:orderId/status", 
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    validation(validators.updateOrderStatusValidation),
    orderController.updateOrderStatus
  );

  return router;
}
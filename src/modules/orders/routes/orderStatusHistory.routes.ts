import { Router } from "express";
import { OrderStatusHistoryController } from "../controllers/orderStatusHistory.controller";
import { auth } from "../../../common/middleware/auth.middleware";
import { userRoleEnum } from "../../../common/enums";

/**
 * Create order status history routes
 */
export function createOrderStatusHistoryRouter(statusHistoryController: OrderStatusHistoryController): Router {
  const router = Router();

  /**
   * @route GET /orders/:orderId/status-history
   * @desc Get order status history
   * @access Private
   */
  router.get(
    "/:orderId/status-history", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    statusHistoryController.getOrderStatusHistory
  );

  /**
   * @route GET /orders/:orderId/latest-status
   * @desc Get latest order status
   * @access Private
   */
  router.get(
    "/:orderId/latest-status", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    statusHistoryController.getLatestStatus
  );

  return router;
}
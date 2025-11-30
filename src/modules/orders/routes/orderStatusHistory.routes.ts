import { Router } from "express";
import { OrderStatusHistoryController } from "../controllers/orderStatusHistory.controller";
import { auth } from "../../../common/middleware/auth.middleware";
import { userRoleEnum } from "../../../common/enums";

export function createOrderStatusHistoryRouter(statusHistoryController: OrderStatusHistoryController): Router {
  const router = Router();

  router.get(
    "/:orderId/status-history", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    statusHistoryController.getOrderStatusHistory
  );

  router.get(
    "/:orderId/latest-status", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    statusHistoryController.getLatestStatus
  );

  return router;
}
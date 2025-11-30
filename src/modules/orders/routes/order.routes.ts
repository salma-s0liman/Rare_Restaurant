import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { auth } from "../../../common/middleware/auth.middleware";
import { validation } from "../../../common/middleware/validation.middleware";
import { userRoleEnum } from "../../../common/enums";
import * as validators from "../validation";

export function createOrderRouter(orderController: OrderController): Router {
  const router = Router();

  router.post(
    "/", 
    auth([userRoleEnum.customer]),
    validation(validators.createOrderValidation),
    orderController.createOrder
  );

  router.get(
    "/my-orders", 
    auth([userRoleEnum.customer]),
    validation(validators.getUserOrdersValidation),
    orderController.getUserOrders
  );

  router.get(
    "/:orderId", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    validation(validators.getOrderDetailValidation),
    orderController.getOrderDetail
  );

  router.get(
    "/number/:orderNumber", 
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    validation(validators.getOrderByNumberValidation),
    orderController.getOrderByNumber
  );

  router.patch(
    "/:orderId/status", 
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    validation(validators.updateOrderStatusValidation),
    orderController.updateOrderStatus
  );

  return router;
}
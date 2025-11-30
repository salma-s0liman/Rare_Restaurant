import { Router } from "express";
import { OrderItemController } from "../controllers/orderItem.controller";
import { auth } from "../../../common/middleware/auth.middleware";
import { userRoleEnum } from "../../../common/enums";

export function createOrderItemRouter(orderItemController: OrderItemController): Router {
  const router = Router();

  router.get(
    "/:orderId/items", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    orderItemController.getOrderItems
  );

  router.get(
    "/order-items/:itemId", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    orderItemController.getOrderItemById
  );

  router.get(
    "/:orderId/total", 
    auth([userRoleEnum.customer, userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    orderItemController.calculateOrderTotal
  );

  return router;
}
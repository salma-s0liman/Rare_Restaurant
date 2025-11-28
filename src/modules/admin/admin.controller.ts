import { Router } from "express";
import adminService from "./admin.service";
import { auth, validation, userRoleEnum } from "../../common";
import * as validators from "./admin.validation";

const router: Router = Router();

// Get restaurant orders
router.get(
  "/restaurants/:restaurantId/orders",
  auth([userRoleEnum.owner, userRoleEnum.admin, userRoleEnum.manager]),
  validation(validators.getRestaurantOrdersValidation),
  adminService.getRestaurantOrders
);

// Get order detail
router.get(
  "/orders/:orderId",
  auth([userRoleEnum.owner, userRoleEnum.admin, userRoleEnum.manager]),
  validation(validators.getOrderDetailValidation),
  adminService.getOrderDetail
);

// Update order status
router.patch(
  "/orders/:orderId/status",
  auth([userRoleEnum.owner, userRoleEnum.admin, userRoleEnum.manager]),
  validation(validators.updateOrderStatusValidation),
  adminService.updateOrderStatus
);

// Assign delivery
router.post(
  "/orders/:orderId/assign-delivery",
  auth([userRoleEnum.owner, userRoleEnum.admin, userRoleEnum.manager]),
  validation(validators.assignDeliveryValidation),
  adminService.assignDelivery
);

// Assign role (owners only)
router.post(
  "/restaurants/:restaurantId/assign-role",
  auth([userRoleEnum.owner]),
  validation(validators.assignRoleValidation),
  adminService.assignRoleToRestaurant
);

export default router;

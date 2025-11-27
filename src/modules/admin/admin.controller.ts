import { Router } from "express";
import * as validators from "./admin.validation";
import adminService from "./admin.service";
import { auth, validation } from "../../common/";
import { userRoleEnum } from "../../common/enums";
const router: Router = Router();

// Get restaurant orders with filters
router.get(
  "/restaurants/:restaurantId/orders",
  auth([userRoleEnum.restaurant_admin]),
  validation(validators.getRestaurantOrdersValidation),
  adminService.getRestaurantOrders
);

// Get order detail
router.get(
  "/orders/:orderId",
  auth([userRoleEnum.restaurant_admin]),
  validation(validators.getOrderDetailValidation),
 // adminService.getOrderDetail
);

// Update order status
router.patch(
  "/orders/:orderId/status",
  auth([userRoleEnum.restaurant_admin]),
  validation(validators.updateOrderStatusValidation),
 // adminService.updateOrderStatus
);

// Assign delivery to order
router.post(
  "/orders/:orderId/assign-delivery",
  auth([userRoleEnum.restaurant_admin]),
  validation(validators.assignDeliveryValidation),
 // adminService.assignDelivery
);

// Get restaurant dashboard
router.get(
  "/restaurants/:restaurantId/dashboard",
  auth([userRoleEnum.restaurant_admin]),
  validation(validators.getDashboardValidation),
 // adminService.getDashboard
);

export default router;

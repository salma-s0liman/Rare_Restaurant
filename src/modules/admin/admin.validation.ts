import { z } from "zod";
import { orderStatusEnum } from "../../common";

// GET /api/admin/restaurants/:restaurantId/orders
export const getRestaurantOrdersValidation = {
  params: z.object({
    restaurantId: z.string().uuid({ message: "Invalid restaurant ID" }),
  }),
  query: z.object({
    status: z
      .enum(orderStatusEnum, {
        message: "Invalid order status",
      })
      .optional(),
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(100).default(20).optional(),
  }),
};

// GET /api/admin/orders/:orderId
export const getOrderDetailValidation = {
  params: z.object({
    orderId: z.string().uuid({ message: "Invalid order ID" }),
  }),
};

// PATCH /api/admin/orders/:orderId/status
export const updateOrderStatusValidation = {
  params: z.object({
    orderId: z.string().uuid({ message: "Invalid order ID" }),
  }),
  body: z.object({
    status: z.enum(orderStatusEnum, {
      message: "Invalid order status",
    }),
    note: z.string().max(500).optional(),
  }),
};

// POST /api/admin/orders/:orderId/assign-delivery
export const assignDeliveryValidation = {
  params: z.object({
    orderId: z.string().uuid({ message: "Invalid order ID" }),
  }),
  body: z.object({
    driverId: z.string().uuid({ message: "Invalid driver ID" }),
  }),
};

// GET /api/admin/restaurants/:restaurantId/dashboard
export const getDashboardValidation = {
  params: z.object({
    restaurantId: z.uuid({ message: "Invalid restaurant ID" }),
  }),
};

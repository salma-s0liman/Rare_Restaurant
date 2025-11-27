import z from "zod";
import * as validators from "./admin.validation";

export type GetRestaurantOrdersDto = z.infer<
  typeof validators.getRestaurantOrdersValidation.query
>;

export type UpdateOrderStatusDto = z.infer<
  typeof validators.updateOrderStatusValidation.body
>;

export type AssignDeliveryDto = z.infer<
  typeof validators.assignDeliveryValidation.body
>;

// Response Interfaces



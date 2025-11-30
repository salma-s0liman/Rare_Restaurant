import { z } from "zod";
import * as validators from "../validation";

export type CreateOrderBodyDto = z.infer<
  typeof validators.createOrderValidation.body
>;

export type GetUserOrdersQueryDto = z.infer<
  typeof validators.getUserOrdersValidation.query
>;

export type GetOrderDetailParamsDto = z.infer<
  typeof validators.getOrderDetailValidation.params
>;

export type GetOrderByNumberParamsDto = z.infer<
  typeof validators.getOrderByNumberValidation.params
>;

export type UpdateOrderStatusParamsDto = z.infer<
  typeof validators.updateOrderStatusValidation.params
>;

export type UpdateOrderStatusBodyDto = z.infer<
  typeof validators.updateOrderStatusValidation.body
>;

export type GetRestaurantOrdersParamsDto = z.infer<
  typeof validators.getRestaurantOrdersValidation.params
>;

export type GetRestaurantOrdersQueryDto = z.infer<
  typeof validators.getRestaurantOrdersValidation.query
>;
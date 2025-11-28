import { z } from "zod";
import { orderStatusEnum } from "../../common/enums/order.enum";
import {
  paymentMethodEnum,
  paymentStatusEnum,
} from "../../common/enums/payment.enum";

export const createOrderValidation = {
  body: z.object({
    restaurantId: z.string().uuid(),
    items: z
      .array(
        z.object({
          menuItemId: z.string().uuid(),
          quantity: z.number().int().min(1),
        })
      )
      .min(1),
    addressId: z.string().uuid(),
    notes: z.string().max(500).optional(),
    paymentMethod: z.nativeEnum(paymentMethodEnum),
  }),
};

export const updateOrderStatusValidation = {
  params: z.object({
    orderId: z.string().uuid(),
  }),
  body: z.object({
    status: z.nativeEnum(orderStatusEnum),
    note: z.string().max(500).optional(),
  }),
};

export const getOrderDetailValidation = {
  params: z.object({
    orderId: z.string().uuid(),
  }),
};

export const getOrdersValidation = {
  query: z.object({
    restaurantId: z.string().uuid().optional(),
    status: z.nativeEnum(orderStatusEnum).optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  }),
};

import { z } from "zod";

export const addCartItem = {
  params: z.object({
    cartId: z.uuid("cartId must be a valid UUID"),
  }),

  body: z.object({
    menuItemId: z.uuid("menuItemId must be a valid UUID"),
    quantity: z
      .number()
      .min(1, "quantity must be at least 1"),
  }),
};

export const updateCartItem = {
  params: z.object({
    cartItemId: z.uuid("cartItemId must be a valid UUID"),
  }),

  body: z.object({
    quantity: z
      .number()
      .min(1, "quantity must be at least 1"),
  }),
};

export const deleteCartItem = {
  params: z.object({
    cartItemId: z.uuid("cartItemId must be a valid UUID"),
  }),
};

import { z } from "zod";

export const createCart = {
  params: z.strictObject({
    restaurantId: z.string().uuid("Invalid restaurantId format"),
  }),
};

export const getCart = {
  params: z.strictObject({
    cartId: z.string().uuid("Invalid cartId format"),
  }),
};

export const deleteCart = {
  params: z.strictObject({
    cartId: z.string().uuid("Invalid cartId format"),
  }),
};

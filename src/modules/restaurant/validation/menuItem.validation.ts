import { z } from "zod";

export const createMenuItemValidation = {
  params: z.object({
    restaurantId: z.uuid(),
  }),
  body: z.strictObject({
    name: z
      .string({ error: "Menu item name must be a string" })
      .min(2)
      .max(200),

    description: z.string().optional().nullable(),

    price: z
      .number({ error: "Price must be a number" })
      .min(0.1, "Price must be greater than zero"),

    is_available: z.boolean().optional().default(true),

    categoryId: z.string().uuid(),
  }),
};

export const updateMenuItemValidation = {
  params: z.object({
    id: z.uuid(),
  }),
  body: z.strictObject({
    name: z.string().min(2).max(200).optional(),
    description: z.string().optional().nullable(),

    price: z.number().min(0.1, "Price must be greater than zero").optional(),

    is_available: z.boolean().optional(),
    categoryId: z.uuid().optional(),
  }),
};

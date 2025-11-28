import { z } from "zod";

export const createMenuItemValidation = {
  body: z.strictObject({
    name: z
      .string({ error: "Menu item name must be a string" })
      .min(2)
      .max(200),

    description: z.string().optional().nullable(),

    price: z
      .number({ error: "Price must be a number" })
      .min(0.1, "Price must be greater than zero"),

    isAvailable: z.boolean().optional().default(true),

    restaurantId: z.string().uuid(),
    categoryId: z.string().uuid(),
  }),
};

export const updateMenuItemValidation = {
  body: z.strictObject({
    name: z.string().min(2).max(200).optional(),
    description: z.string().optional().nullable(),

    price: z
      .number()
      .min(0.1, "Price must be greater than zero")
      .optional(),

    isAvailable: z.boolean().optional(),
    categoryId: z.string().uuid().optional(),
  }),
};

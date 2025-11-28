import { z } from "zod";

export const createCategoryValidation = {
  body: z.strictObject({
    name: z
      .string({ error: "Category name must be a string" })
      .min(2)
      .max(150),

    description: z.string().optional().nullable(),

    restaurantId: z
      .string({
        error: "restaurantId must be a valid UUID",
      })
      .uuid(),
  }),
};

export const updateCategoryValidation = {
  body: z.strictObject({
    name: z.string().min(2).max(150).optional(),
    description: z.string().optional().nullable(),
  }),
};

import { z } from "zod";

export const createCategoryValidation = {
  params: z.object({
    restaurantId: z.uuid({
      error: "restaurantId must be a valid UUID",
    }),
  }),
  body: z.strictObject({
    name: z.string({ error: "Category name must be a string" }).min(2).max(150),

    description: z.string().optional().nullable(),
  }),
};

export const updateCategoryValidation = {
  body: z.strictObject({
    name: z.string().min(2).max(150).optional(),
    description: z.string().optional().nullable(),
  }),
};

import { z } from "zod";

export const createMenuItemImageValidation = {
  body: z.strictObject({
    url: z
      .string({
        error: "Image URL must be a string",
      })
      .url("Invalid image URL format"),

    altText: z
      .string()
      .max(255)
      .optional()
      .nullable(),

    isPrimary: z.boolean().optional().default(false),
  }),
};

import { z } from "zod";

export const createMenuItemImageValidation = {
  body: z.strictObject({
    url: z
      .string({
        error: "Image URL must be a string",
      })
      .url("Invalid image URL format"),

    alt_text: z
      .string()
      .max(255)
      .optional()
      .nullable(),

    is_primary: z.boolean().optional().default(false),
  }),
};

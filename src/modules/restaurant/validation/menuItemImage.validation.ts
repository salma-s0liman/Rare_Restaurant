import { z } from "zod";

export const createMenuItemImageValidation = {
  body: z.strictObject({
    url: z
      .url("Invalid image URL format"),

    alt_text: z.string().max(255).optional().nullable(),

    is_primary: z.boolean().optional().default(false),
  }),
};

export const updateMenuItemImageValidation = {
  params: z.strictObject({
    imageId: z.uuid(),
  }),
  body: z.strictObject({
    url: z.url("Invalid image URL format").optional(),

    alt_text: z.string().max(255).optional().nullable(),

    is_primary: z.boolean().optional(),
  }),
};

export const deleteMenuItemImageValidation = {
  params: z.strictObject({
    imageId: z.string().uuid(),
  }),
};

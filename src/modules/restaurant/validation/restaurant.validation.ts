import { z } from "zod";

export const createRestaurantValidation = {
  body: z.strictObject({
    name: z
      .string({ error: "Restaurant name must be a string" })
      .min(3, "Restaurant name must be at least 3 characters"),

    phone: z
      .string()
      .regex(/^[0-9+\- ]{6,20}$/, {
        error: "Invalid phone number format",
      })
      .optional()
      .nullable(),

    address: z.string().min(3).optional().nullable(),

    currency: z
      .string()
      .min(3)
      .max(5)
      .default("USD"),

    isActive: z.boolean().optional().default(true),
  }),
};

export const updateRestaurantValidation = {
  body: z.strictObject({
    name: z.string().min(3).optional(),

    phone: z
      .string()
      .regex(/^[0-9+\- ]{6,20}$/, {
        error: "Invalid phone number format",
      })
      .optional()
      .nullable(),

    address: z.string().min(3).optional().nullable(),

    currency: z.string().min(3).max(5).optional(),

    isActive: z.boolean().optional(),
  }),
};

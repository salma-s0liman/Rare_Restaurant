import { z } from "zod";

export const createAddressValidation = {
  body: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    is_primary: z.boolean().optional(),
  }),
};

export const updateAddressValidation = {
  params: z.object({
    id: z.uuid("Invalid address ID"),
  }),
  body: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    is_primary: z.boolean().optional(),
  }),
};

export const addressIdValidation = {
  params: z.object({
    id: z.string().uuid("Invalid address ID"),
  }),
};

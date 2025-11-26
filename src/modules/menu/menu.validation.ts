import { z } from "zod";

// Menu Item Validations
export const createMenuItemValidation = z.object({
  name: z
    .string()
    .min(2, "Menu item name must be at least 2 characters")
    .max(200, "Menu item name cannot exceed 200 characters"),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  price: z
    .number()
    .positive("Price must be a positive number")
    .multipleOf(0.01, "Price must have at most 2 decimal places"),
  category_id: z.string().uuid("Category ID must be a valid UUID"),
  is_available: z.boolean().default(true).optional(),
});

export const updateMenuItemValidation = z.object({
  name: z
    .string()
    .min(2, "Menu item name must be at least 2 characters")
    .max(200, "Menu item name cannot exceed 200 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  price: z
    .number()
    .positive("Price must be a positive number")
    .multipleOf(0.01, "Price must have at most 2 decimal places")
    .optional(),
  category_id: z.string().uuid("Category ID must be a valid UUID").optional(),
  is_available: z.boolean().optional(),
});

// Category Validations
export const createCategoryValidation = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(150, "Category name cannot exceed 150 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

// Menu Item Image Validations
export const addMenuItemImageValidation = z.object({
  url: z
    .string()
    .url("Image URL must be a valid URL")
    .max(1000, "Image URL cannot exceed 1000 characters"),
  alt_text: z
    .string()
    .max(255, "Alt text cannot exceed 255 characters")
    .optional(),
  is_primary: z.boolean().default(false).optional(),
});

// Query Validations
export const menuQueryValidation = z.object({
  category_id: z.string().uuid("Category ID must be a valid UUID").optional(),
  min_price: z.coerce
    .number()
    .positive("Minimum price must be positive")
    .optional(),
  max_price: z.coerce
    .number()
    .positive("Maximum price must be positive")
    .optional(),
  available_only: z.coerce.boolean().default(true).optional(),
  search: z
    .string()
    .max(100, "Search term cannot exceed 100 characters")
    .optional(),
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be at least 1")
    .default(1)
    .optional(),
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(20)
    .optional(),
});

export const restaurantQueryValidation = z.object({
  active_only: z.coerce.boolean().default(true).optional(),
  search: z
    .string()
    .max(100, "Search term cannot exceed 100 characters")
    .optional(),
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be at least 1")
    .default(1)
    .optional(),
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .default(10)
    .optional(),
});

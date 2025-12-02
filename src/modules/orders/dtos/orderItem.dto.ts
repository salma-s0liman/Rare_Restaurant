import { z } from "zod";

// Create Order Item DTO
export const CreateOrderItemDto = z.object({
  menuItemId: z
    .uuid("Invalid menu item ID format"),
  
  quantity: z.number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(99, "Quantity cannot exceed 99"),
  
  priceAtOrder: z.number()
    .min(0, "Price cannot be negative")
    .max(9999.99, "Price too high"),
  
  itemNameSnapshot: z.string()
    .trim()
    .min(1, "Item name is required")
    .max(200, "Item name too long")
});

export type CreateOrderItemDto = z.infer<typeof CreateOrderItemDto>;





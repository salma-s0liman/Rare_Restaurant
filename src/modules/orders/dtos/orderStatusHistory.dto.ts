import { z } from "zod";
import { orderStatusEnum } from "../../../common/enums";

// Create Order Status History DTO
export const CreateOrderStatusHistoryDto = z.object({
  orderId: z
    .uuid("Invalid order ID format"),
  
  previousStatus: z.enum(orderStatusEnum)
    .optional(),
  
  newStatus: z.enum(orderStatusEnum, {
    message: "Invalid order status"
  }),
  
  note: z.string()
    .trim()
    .max(500, "Note cannot exceed 500 characters")
    .optional(),
  
  changedById: z.uuid("Invalid changed by user ID format")
    .optional()
});

export type CreateOrderStatusHistoryDto = z.infer<typeof CreateOrderStatusHistoryDto>;


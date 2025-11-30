import { z } from "zod";
import { orderStatusEnum } from "../../../common/enums";

// Create Order Status History DTO
export const CreateOrderStatusHistoryDto = z.object({
  orderId: z.string()
    .trim()
    .min(1, "Order ID is required")
    .uuid("Invalid order ID format"),
  
  previousStatus: z.nativeEnum(orderStatusEnum)
    .optional(),
  
  newStatus: z.nativeEnum(orderStatusEnum, {
    message: "Invalid order status"
  }),
  
  note: z.string()
    .trim()
    .max(500, "Note cannot exceed 500 characters")
    .optional(),
  
  changedById: z.string()
    .trim()
    .uuid("Invalid changed by user ID format")
    .optional()
});

export type CreateOrderStatusHistoryDto = z.infer<typeof CreateOrderStatusHistoryDto>;

// Status History Response DTO
export interface StatusHistoryDto {
  id: string;
  previousStatus?: orderStatusEnum;
  newStatus: orderStatusEnum;
  changedAt: Date;
  changedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  note?: string;
}

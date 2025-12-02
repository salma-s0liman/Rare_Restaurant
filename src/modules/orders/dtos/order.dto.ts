import { z } from "zod";
import { orderStatusEnum, paymentMethodEnum, paymentStatusEnum } from "../../../common/enums";

export const CreateOrderDto = z.object({
  cartId: z
    .uuid("Invalid cart ID format").trim(),
  
  addressId: z
    .uuid("Invalid address ID format").trim(),
  
  paymentMethod: z.enum(paymentMethodEnum, {
    message: "Invalid payment method"
  }),
  
  notes: z.string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
  
  deliveryFee: z.number()
    .min(0, "Delivery fee cannot be negative")
    .max(999.99, "Delivery fee too high")
    .optional()
    .default(0),
  
  discount: z.number()
    .min(0, "Discount cannot be negative")
    .max(999.99, "Discount too high")
    .optional()
    .default(0),
  
  tax: z.number()
    .min(0, "Tax cannot be negative")
    .max(999.99, "Tax too high")
    .optional()
    .default(0)
});

export const UpdateOrderStatusDto = z.object({
  status: z.enum(orderStatusEnum, {
    message: "Invalid order status"
  }),
  
  notes: z.string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
  
  changedBy: z.string()
    .trim()
    .min(1, "Changed by user ID is required")
    .uuid("Invalid user ID format")
});

// Get Orders Query DTO
export const GetOrdersQueryDto = z.object({
  status: z.enum(orderStatusEnum).optional(),
  paymentStatus: z.enum(paymentStatusEnum).optional(),
  userId: z.uuid().optional(),
  restaurantId: z.uuid().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.enum(["placed_at", "total_amount", "status"]).default("placed_at"),
  sortOrder: z.enum(["ASC", "DESC"]).default("DESC")
});

// Type exports
export type CreateOrderDto = z.infer<typeof CreateOrderDto>;
export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusDto>;
export type GetOrdersQueryDto = z.infer<typeof GetOrdersQueryDto>;

// Response DTOs
export interface OrderSummaryDto {
  id: string;
  orderNumber: number;
  status: orderStatusEnum;
  paymentStatus: paymentStatusEnum;
  totalAmount: number;
  placedAt: Date;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
  };
  restaurant: {
    id: string;
    name: string;
  };
  itemCount: number;
}

export interface OrderDetailDto {
  id: string;
  orderNumber: number;
  status: orderStatusEnum;
  subtotal: number;
  tax: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  placedAt: Date;
  paidAt?: Date;
  paymentStatus: paymentStatusEnum;
  paymentMethod: paymentMethodEnum;
  notes?: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  restaurant: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
  };
  address: {
    street: string;
    city: string;
    postalCode?: string;
    country: string;
  };
  items: Array<{
    id: string;
    itemNameSnapshot: string;
    quantity: number;
    priceAtOrder: number;
    subtotal: number;
  }>;
  statusHistory: Array<{
    previousStatus?: orderStatusEnum;
    newStatus: orderStatusEnum;
    changedAt: Date;
    changedBy?: string;
    notes?: string;
  }>;
}


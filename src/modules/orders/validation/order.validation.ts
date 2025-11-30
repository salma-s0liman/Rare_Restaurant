import { z } from "zod";
import { orderStatusEnum, paymentMethodEnum } from "../../../common/enums";

// Create order validation
export const createOrderValidation = {
  body: z.object({
    cartId: z.string()
      .trim()
      .min(1, "Cart ID is required")
      .uuid("Invalid cart ID format"),
    
    addressId: z.string()
      .trim()
      .min(1, "Address ID is required")
      .uuid("Invalid address ID format"),
    
    paymentMethod: z.nativeEnum(paymentMethodEnum, {
      message: "Invalid payment method"
    }),
    
    notes: z.string()
      .trim()
      .max(500, "Notes cannot exceed 500 characters")
      .optional()
  })
};

// Get user orders validation
export const getUserOrdersValidation = {
  query: z.object({
    status: z.nativeEnum(orderStatusEnum)
      .optional(),
    
    page: z.coerce.number()
      .min(1, "Page must be at least 1")
      .default(1)
      .optional(),
    
    limit: z.coerce.number()
      .min(1, "Limit must be at least 1")
      .max(50, "Limit cannot exceed 50")
      .default(10)
      .optional()
  })
};

// Get order detail validation
export const getOrderDetailValidation = {
  params: z.object({
    orderId: z.string()
      .trim()
      .uuid("Invalid order ID format")
  })
};

// Get order by number validation
export const getOrderByNumberValidation = {
  params: z.object({
    orderNumber: z.string()
      .trim()
      .min(1, "Order number is required")
  })
};

// Update order status validation
export const updateOrderStatusValidation = {
  params: z.object({
    orderId: z.string()
      .trim()
      .uuid("Invalid order ID format")
  }),
  
  body: z.object({
    status: z.nativeEnum(orderStatusEnum, {
      message: "Invalid order status"
    }),
    
    notes: z.string()
      .trim()
      .max(500, "Notes cannot exceed 500 characters")
      .optional(),
    
    changedBy: z.string()
      .trim()
      .uuid("Invalid changed by user ID format")
      .optional()
  })
};

// Get restaurant orders validation
export const getRestaurantOrdersValidation = {
  params: z.object({
    restaurantId: z.string()
      .trim()
      .uuid("Invalid restaurant ID format")
  }),
  
  query: z.object({
    status: z.nativeEnum(orderStatusEnum)
      .optional(),
    
    startDate: z.string()
      .datetime("Invalid start date format")
      .optional(),
    
    endDate: z.string()
      .datetime("Invalid end date format")
      .optional(),
    
    page: z.coerce.number()
      .min(1, "Page must be at least 1")
      .default(1)
      .optional(),
    
    limit: z.coerce.number()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .default(20)
      .optional()
  })
};
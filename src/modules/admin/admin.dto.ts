import { z } from "zod";
import * as validators from "./admin.validation";

// Request DTOs
export type GetRestaurantOrdersDto = z.infer<
  typeof validators.getRestaurantOrdersValidation.query
>;

export type UpdateOrderStatusDto = z.infer<
  typeof validators.updateOrderStatusValidation.body
>;

export type AssignDeliveryDto = z.infer<
  typeof validators.assignDeliveryValidation.body
>;

export type AssignRoleDto = z.infer<
  typeof validators.assignRoleValidation.body
>;

// Response Interfaces
export interface OrderListItem {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  placedAt: Date;
  paymentStatus: string;
  customer: {
    id: string;
    name: string;
  };
  itemCount: number;
  deliveryAssigned: boolean;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  placedAt: Date;
  paidAt: Date | null;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  } | null;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  paymentStatus: string;
  delivery?: {
    driverId: string;
    driverName: string;
    estimatedTime?: string;
  };
}

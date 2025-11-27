export interface DashboardStatsDto {
  activeOrders: number;
  pendingOrders: number;
  todayStats: {
    totalOrders: number;
    totalRevenue: number;
    completedOrders: number;
    cancelledOrders: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    placedAt: Date;
    customerName: string;
  }>;
}

export interface OrderDetailDto {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  placedAt: Date;
  paidAt?: Date;
  paymentStatus: string;
  paymentMethod: string;
  notes?: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address?: {
    street: string;
    city: string;
    postalCode?: string;
    country: string;
  };
  items: Array<{
    id: string;
    itemName: string;
    quantity: number;
    priceAtOrder: number;
    subtotal: number;
  }>;
  delivery?: {
    id: string;
    assignedAt?: Date;
    acceptedAt?: Date;
    completedAt?: Date;
    driver?: {
      id: string;
      firstName: string;
      lastName: string;
      phone: string;
    };
  };
  statusHistory: Array<{
    previousStatus?: string;
    newStatus: string;
    changedAt: Date;
    changedBy?: string;
    note?: string;
  }>;
}

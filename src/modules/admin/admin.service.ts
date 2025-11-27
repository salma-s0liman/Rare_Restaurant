import type { Request, Response, NextFunction } from "express";
import { adminRepository } from "./admin.repository";
import { userRepository } from "../user/user.repository";
import {
  BadRequestException,
  NotfoundException,
 // ApplicationException,
 // orderStatusEnum,
  userRoleEnum,
} from "../../common/";
import {
  GetRestaurantOrdersDto,
 // UpdateOrderStatusDto,
 // AssignDeliveryDto,
} from "./admin.dto";

class AdminService {
  // Helper: Verify admin has access to restaurant
  private async verifyRestaurantAccess(
    restaurantId: string,
    adminUserId: string
  ) {
    const admin = await userRepository.findOne({
      where: { id: adminUserId },
      relations: ["adminRoles", "adminRoles.restaurant"],
    });

    if (!admin) {
      throw new NotfoundException("Admin user not found");
    }

    if (admin.role !== userRoleEnum.restaurant_admin) {
      throw new BadRequestException("User is not a restaurant admin");
    }

    // Check if admin manages this restaurant via RestaurantAdmin relation
    const hasAccess = admin.adminRoles?.some(
      (role) => role.restaurant.id === restaurantId
    );

    if (!hasAccess) {
      throw new BadRequestException(
        "You do not have access to this restaurant"
      );
    }
  }
  // Get restaurant orders with filters
  getRestaurantOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const restaurantId = req.params.restaurantId!;
    const { status, page, limit } = req.query;

    // Verify admin has access to this restaurant
    await this.verifyRestaurantAccess(restaurantId, req.user!.id);

    const filters: GetRestaurantOrdersDto = {
      status: status as any,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    };

    const { orders, total } = await adminRepository.findRestaurantOrders(
      restaurantId,
      filters.status,
      filters.page,
      filters.limit
    );

    const result = {
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        totalAmount: Number(order.total_amount),
        placedAt: order.placed_at!,
        paymentStatus: order.payment_status,
        customer: {
          id: order.user.id,
          name: `${order.user.firstName} ${order.user.lastName}`,
        },
        itemCount: order.items?.length || 0,
        deliveryAssigned: !!order.delivery,
      })),
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / (filters.limit || 20)),
      },
    };

    return res.status(200).json({
      message: "Orders retrieved successfully",
      data: result,
    });
  };

  // Get detailed order information
  // getOrderDetail = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response> => {
  //   const orderId = req.params.orderId!;
  //   const order = await adminRepository.findOrderDetail(orderId);

  //   if (!order) {
  //     throw new NotfoundException("Order not found");
  //   }

  //   // Verify admin has access to this order's restaurant
  //   await this.verifyRestaurantAccess(order.restaurant.id, req.user!.id);

  //   const result = {
  //     id: order.id,
  //     orderNumber: order.order_number,
  //     status: order.status,
  //     placedAt: order.placed_at!,
  //     paidAt: order.paid_at || null,
  //     customer: {
  //       id: order.user.id,
  //       name: `${order.user.firstName} ${order.user.lastName}`,
  //       email: order.user.email,
  //       phone: order.user.phone,
  //     },
  //     deliveryAddress: order.address
  //       ? {
  //           street: order.address.street,
  //           city: order.address.city,
  //           postalCode: order.address.postal_code || "",
  //           country: order.address.country,
  //         }
  //       : null,
  //     items:
  //       order.items?.map((item) => ({
  //         id: item.id,
  //         name: item.item_name_snapshot,
  //         quantity: item.quantity,
  //         priceAtOrder: Number(item.price_at_order),
  //         subtotal: Number(item.price_at_order) * item.quantity,
  //       })) || [],
  //     pricing: {
  //       subtotal: Number(order.subtotal),
  //       tax: Number(order.tax || 0),
  //       discount: Number(order.discount || 0),
  //       deliveryFee: Number(order.delivery_fee || 0),
  //       totalAmount: Number(order.total_amount),
  //     },
  //     payment: {
  //       method: order.payment_method,
  //       status: order.payment_status,
  //       transactionId: null,
  //     },
  //     delivery:
  //       order.delivery && order.delivery.length > 0 && order.delivery[0]
  //         ? {
  //             id: order.delivery[0].id,
  //             assignedAt: order.delivery[0].assigned_at || null,
  //             acceptedAt: order.delivery[0].accepted_at || null,
  //             completedAt: order.delivery[0].completed_at || null,
  //             driver: order.delivery[0].deliveryUser
  //               ? {
  //                   id: order.delivery[0].deliveryUser.id,
  //                   name: `${order.delivery[0].deliveryUser.firstName} ${order.delivery[0].deliveryUser.lastName}`,
  //                   phone: order.delivery[0].deliveryUser.phone,
  //                 }
  //               : null,
  //           }
  //         : null,
  //     statusHistory: order.statusHistory
  //       ? order.statusHistory.map((history) => ({
  //           id: history.id,
  //           previousStatus: history.previous_status || null,
  //           newStatus: history.new_status,
  //           changedAt: history.created_at!,
  //           changedBy: history.changedBy
  //             ? `${history.changedBy.firstName} ${history.changedBy.lastName}`
  //             : "System",
  //           note: history.note || null,
  //         }))
  //       : [],
  //     notes: order.notes || null,
  //   };

  //   return res.status(200).json({
  //     message: "Order details retrieved successfully",
  //     data: result,
  //   });
  // };

  // Update order status
  // updateOrderStatus = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response> => {
  //   const orderId = req.params.orderId!;
  //   const { status, note } = req.body as UpdateOrderStatusDto;
  //   const order = await adminRepository.findById(orderId);

  //   if (!order) {
  //     throw new NotfoundException("Order not found");
  //   }

  //   // Verify admin has access to this order's restaurant
  //   await this.verifyRestaurantAccess(order.restaurant.id, req.user!.id);

  //   // Validate status transition
  //   this.validateStatusTransition(order.status, status);

  //   const updatedOrder = await adminRepository.updateOrderStatus(
  //     orderId,
  //     status,
  //     req.user!.id,
  //     note
  //   );

  //   if (!updatedOrder) {
  //     throw new ApplicationException("Failed to update order status");
  //   }

  //   return res.status(200).json({
  //     success: true,
  //     message: "Order status updated successfully",
  //     order: {
  //       id: updatedOrder.id,
  //       orderNumber: updatedOrder.order_number,
  //       previousStatus: order.status,
  //       newStatus: updatedOrder.status,
  //     },
  //   });
  // };

  // Assign delivery person to order
  // assignDelivery = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response> => {
  //   const orderId = req.params.orderId!;
  //   const { driverId } = req.body as AssignDeliveryDto;
  //   const order = await adminRepository.findById(orderId);

  //   if (!order) {
  //     throw new NotfoundException("Order not found");
  //   }

  //   // Verify admin has access to this order's restaurant
  //   await this.verifyRestaurantAccess(order.restaurant.id, req.user!.id);

  //   // Verify order is ready for delivery assignment
  //   if (
  //     order.status !== orderStatusEnum.ready &&
  //     order.status !== orderStatusEnum.preparing
  //   ) {
  //     throw new BadRequestException(
  //       "Order must be in 'ready' or 'preparing' status to assign delivery"
  //     );
  //   }

  //   // Verify driver exists and has delivery role
  //   const driver = await userRepository.findById(driverId);

  //   if (!driver) {
  //     throw new NotfoundException("Driver not found");
  //   }

  //   if (driver.role !== userRoleEnum.delivery) {
  //     throw new BadRequestException("User is not a delivery driver");
  //   }

  //   const delivery = await adminRepository.assignDelivery(orderId, driverId);

  //   return res.status(200).json({
  //     success: true,
  //     message: "Delivery assigned successfully",
  //     delivery: {
  //       id: delivery.id,
  //       orderId: orderId,
  //       driverId: driverId,
  //       driverName: `${driver.firstName} ${driver.lastName}`,
  //       assignedAt: delivery.assigned_at!,
  //     },
  //   });
  // };

  // Get dashboard statistics
  // getDashboard = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response> => {
  //   const restaurantId = req.params.restaurantId!;
  //   // Verify admin has access to this restaurant
  //   await this.verifyRestaurantAccess(restaurantId, req.user!.id);

  //   const stats = await adminRepository.getDashboardStats(restaurantId);

  //   const result = {
  //     activeOrders: stats.activeOrders,
  //     pendingOrders: stats.pendingOrders,
  //     todayStats: {
  //       totalOrders: stats.todayStats.totalOrders,
  //       totalRevenue: stats.todayStats.totalRevenue,
  //       completedOrders: stats.todayStats.completedOrders,
  //       cancelledOrders: stats.todayStats.cancelledOrders,
  //     },
  //     recentOrders: stats.recentOrders,
  //   };

  //   return res.status(200).json({
  //     message: "Dashboard data retrieved successfully",
  //     data: result,
  //   });
  // };

  // Helper: Validate status transition
  // private validateStatusTransition(
  //   currentStatus: orderStatusEnum,
  //   newStatus: orderStatusEnum
  // ) {
  //   const validTransitions: Record<orderStatusEnum, orderStatusEnum[]> = {
  //     [orderStatusEnum.placed]: [
  //       orderStatusEnum.preparing,
  //       orderStatusEnum.cancelled,
  //     ],
  //     [orderStatusEnum.preparing]: [
  //       orderStatusEnum.ready,
  //       orderStatusEnum.cancelled,
  //     ],
  //     [orderStatusEnum.ready]: [
  //       orderStatusEnum.on_the_way,
  //       orderStatusEnum.cancelled,
  //     ],
  //     [orderStatusEnum.on_the_way]: [
  //       orderStatusEnum.delivered,
  //       orderStatusEnum.cancelled,
  //     ],
  //     [orderStatusEnum.delivered]: [],
  //     [orderStatusEnum.cancelled]: [],
  //   };

  //   const allowedTransitions = validTransitions[currentStatus] || [];

  //   if (!allowedTransitions.includes(newStatus)) {
  //     throw new BadRequestException(
  //       `Invalid status transition from '${currentStatus}' to '${newStatus}'`
  //     );
  //   }
  // }
}

export default new AdminService();

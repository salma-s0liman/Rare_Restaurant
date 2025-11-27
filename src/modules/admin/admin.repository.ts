import { Order, Delivery } from "../../DB";
import { AppDataSource } from "../../DB/data-source";
import { BaseRepository, orderStatusEnum } from "../../common";
import { Between } from "typeorm";

class AdminRepository extends BaseRepository<Order> {
  private deliveryRepo = AppDataSource.getRepository(Delivery);

  constructor() {
    super(AppDataSource.getRepository(Order));
  }

  // Get orders for a specific restaurant with filters
  async findRestaurantOrders(
    restaurantId: string,
    status?: orderStatusEnum,
    page: number = 1,
    limit: number = 20
  ): Promise<{ orders: Order[]; total: number }> {
    const skip = (page - 1) * limit;

    const whereConditions: any = {
      restaurant: { id: restaurantId },
    };

    if (status) {
      whereConditions.status = status;
    }

    const [orders, total] = await this.repo.findAndCount({
      where: whereConditions,
      relations: ["user", "items", "delivery", "delivery.deliveryUser"],
      select: {
        id: true,
        order_number: true,
        status: true,
        total_amount: true,
        placed_at: true,
        payment_status: true,
        user: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      order: {
        placed_at: "DESC",
      },
      skip,
      take: limit,
    });

    return { orders, total };
  }

  // Get detailed order information
  async findOrderDetail(orderId: string): Promise<Order | null> {
    return this.repo.findOne({
      where: { id: orderId },
      relations: [
        "user",
        "restaurant",
        "address",
        "items",
        "items.menu_item",
        "delivery",
        "delivery.deliveryUser",
        "statusHistory",
        "statusHistory.changedBy",
      ],
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
        restaurant: {
          id: true,
          name: true,
        },
        address: {
          street: true,
          city: true,
          postal_code: true,
          country: true,
        },
        items: {
          id: true,
          quantity: true,
          price_at_order: true,
          item_name_snapshot: true,
        },
        delivery: {
          id: true,
          assigned_at: true,
          accepted_at: true,
          completed_at: true,
          deliveryUser: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        statusHistory: {
          id: true,
          previous_status: true,
          new_status: true,
          created_at: true,
          note: true,
          changedBy: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Update order status
  async updateOrderStatus(
    orderId: string,
    newStatus: orderStatusEnum,
    userId: string,
    note?: string
  ): Promise<Order | null> {
    const order = await this.findById(orderId);
    if (!order) return null;

    const previousStatus = order.status;
    order.status = newStatus;

    const updatedOrder = await this.repo.save(order);

    // Create status history entry
    await AppDataSource.getRepository("OrderStatusHistory").save({
      order: { id: orderId },
      previous_status: previousStatus,
      new_status: newStatus,
      changed_by_user_id: userId,
      actor_type: "restaurant_admin",
      note: note || `Status changed from ${previousStatus} to ${newStatus}`,
    });

    return updatedOrder;
  }

  // Assign delivery person to order
  async assignDelivery(orderId: string, driverId: string): Promise<Delivery> {
    // Check if delivery already exists
    const existingDelivery = await this.deliveryRepo.findOne({
      where: { order: { id: orderId } },
    });

    if (existingDelivery) {
      // Update existing delivery
      existingDelivery.deliveryUser = { id: driverId } as any;
      existingDelivery.assigned_at = new Date();
      return await this.deliveryRepo.save(existingDelivery);
    }

    // Create new delivery
    const delivery = this.deliveryRepo.create({
      order: { id: orderId },
      deliveryUser: { id: driverId },
      assigned_at: new Date(),
    });

    return await this.deliveryRepo.save(delivery);
  }

  // Get dashboard statistics
  async getDashboardStats(restaurantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Active orders (preparing, ready, on_the_way)
    const activeOrders = await this.repo.count({
      where: {
        restaurant: { id: restaurantId },
        status: Between(
          orderStatusEnum.preparing,
          orderStatusEnum.on_the_way
        ) as any,
      },
    });

    // Pending orders (placed)
    const pendingOrders = await this.repo.count({
      where: {
        restaurant: { id: restaurantId },
        status: orderStatusEnum.placed,
      },
    });

    // Today's orders
    const todayOrders = await this.repo.find({
      where: {
        restaurant: { id: restaurantId },
        placed_at: Between(today, tomorrow) as any,
      },
    });

    const todayStats = {
      totalOrders: todayOrders.length,
      totalRevenue: todayOrders.reduce(
        (sum, order) => sum + Number(order.total_amount),
        0
      ),
      completedOrders: todayOrders.filter(
        (o) => o.status === orderStatusEnum.delivered
      ).length,
      cancelledOrders: todayOrders.filter(
        (o) => o.status === orderStatusEnum.cancelled
      ).length,
    };

    // Recent orders
    const recentOrders = await this.repo.find({
      where: {
        restaurant: { id: restaurantId },
      },
      relations: ["user"],
      select: {
        id: true,
        order_number: true,
        status: true,
        total_amount: true,
        placed_at: true,
        user: {
          firstName: true,
          lastName: true,
        },
      },
      order: {
        placed_at: "DESC",
      },
      take: 10,
    });

    return {
      activeOrders,
      pendingOrders,
      todayStats,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        totalAmount: Number(order.total_amount),
        placedAt: order.placed_at!,
        customerName: `${order.user.firstName} ${order.user.lastName}`,
      })),
    };
  }
}

export const adminRepository = new AdminRepository();

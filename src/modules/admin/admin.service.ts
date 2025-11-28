import type { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../DB/data-source";
import { RestaurantAdmin, Order, User, Delivery } from "../../DB/entity";
import {
  BadRequestException,
  NotfoundException,
  userRoleEnum,
} from "../../common";

class AdminService {
  private async checkRestaurantAccess(restaurantId: string, userId: string) {
    const access = await AppDataSource.getRepository(RestaurantAdmin).findOne({
      where: {
        user: { id: userId },
        restaurant: { id: restaurantId },
      },
    });

    if (!access) {
      throw new BadRequestException("You don't have access to this restaurant");
    }
    return access;
  }

  // GET /api/admin/restaurants/:restaurantId/orders
  getRestaurantOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { restaurantId } = req.params;

      if (!restaurantId)
        throw new BadRequestException("Restaurant ID required");

      // Debug: Log user info
      console.log("Admin access attempt - User:", {
        id: req.user!.id,
        role: req.user!.role,
        email: req.user!.email,
      });

      await this.checkRestaurantAccess(restaurantId, req.user!.id);

      const orderRepo = AppDataSource.getRepository(Order);
      const orders = await orderRepo.find({
        where: { restaurant: { id: restaurantId } },
        relations: ["user", "items"],
        order: { placed_at: "DESC" },
      });

      const result = orders.map((order) => ({
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        totalAmount: Number(order.total_amount),
        placedAt: order.placed_at,
        customer: `${order.user.firstName} ${order.user.lastName}`,
        itemCount: order.items?.length || 0,
      }));

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/admin/orders/:orderId
  getOrderDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;

      const order = await AppDataSource.getRepository(Order).findOne({
        where: { id: orderId },
        relations: ["user", "items", "address", "restaurant"],
      });

      if (!order) {
        throw new NotfoundException("Order not found");
      }

      await this.checkRestaurantAccess(order.restaurant.id, req.user!.id);

      const result = {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        totalAmount: Number(order.total_amount),
        placedAt: order.placed_at,
        customer: {
          name: `${order.user.firstName} ${order.user.lastName}`,
          email: order.user.email,
          phone: order.user.phone,
        },
        items:
          order.items?.map((item) => ({
            name: item.item_name_snapshot,
            quantity: item.quantity,
            price: Number(item.price_at_order),
          })) || [],
      };

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  // PATCH /api/admin/orders/:orderId/status
  updateOrderStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      if (!orderId) throw new BadRequestException("Order ID required");
      if (!status) throw new BadRequestException("Status required");

      // Explicit role check - customers should never reach admin endpoints
      if (req.user!.role === userRoleEnum.customer) {
        throw new BadRequestException(
          "Customers are not allowed to access admin endpoints"
        );
      }

      const order = await AppDataSource.getRepository(Order).findOne({
        where: { id: orderId },
        relations: ["restaurant"],
      });

      if (!order) {
        throw new NotfoundException("Order not found");
      }

      await this.checkRestaurantAccess(order.restaurant.id, req.user!.id);

      await AppDataSource.getRepository(Order).update(orderId, { status });

      res.json({
        success: true,
        message: "Order status updated",
        data: { orderId, newStatus: status },
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/admin/orders/:orderId/assign-delivery
  assignDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const { driverId } = req.body;

      // Explicit role check - customers should never reach admin endpoints
      if (req.user!.role === userRoleEnum.customer) {
        throw new BadRequestException(
          "Customers are not allowed to access admin endpoints"
        );
      }

      const order = await AppDataSource.getRepository(Order).findOne({
        where: { id: orderId },
        relations: ["restaurant"],
      });

      if (!order) {
        throw new NotfoundException("Order not found");
      }

      await this.checkRestaurantAccess(order.restaurant.id, req.user!.id);

      const driver = await AppDataSource.getRepository(User).findOne({
        where: { id: driverId, role: userRoleEnum.delivery },
      });

      if (!driver) {
        throw new NotfoundException("Driver not found");
      }

      const deliveryRepo = AppDataSource.getRepository(Delivery);
      const delivery = deliveryRepo.create({
        order: { id: orderId } as any,
        deliveryUser: driver,
        assigned_at: new Date(),
      });

      await deliveryRepo.save(delivery);

      res.json({
        success: true,
        message: "Driver assigned successfully",
        data: {
          orderId,
          driverId,
          driverName: `${driver.firstName} ${driver.lastName}`,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/admin/restaurants/:restaurantId/assign-role
  assignRoleToRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { restaurantId } = req.params;
      const { userId, role } = req.body;

      if (!restaurantId || !userId)
        throw new BadRequestException("Restaurant ID and User ID required");

      await this.checkRestaurantAccess(restaurantId, req.user!.id);

      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotfoundException("User not found");
      }

      const existingAdmin = await AppDataSource.getRepository(
        RestaurantAdmin
      ).findOne({
        where: { user: { id: userId }, restaurant: { id: restaurantId } },
      });

      if (existingAdmin) {
        throw new BadRequestException(
          "User already assigned to this restaurant"
        );
      }

      const restaurantAdmin = AppDataSource.getRepository(
        RestaurantAdmin
      ).create({
        user: { id: userId } as any,
        restaurant: { id: restaurantId } as any,
        role: role,
      });

      await AppDataSource.getRepository(RestaurantAdmin).save(restaurantAdmin);

      // Update user's system role to match restaurant role
      if (user.role === "customer") {
        user.role = role as any;
        await AppDataSource.getRepository(User).save(user);
      }

      res.json({
        success: true,
        message: "User assigned successfully",
        data: {
          userId,
          restaurantId,
          role,
          userName: `${user.firstName} ${user.lastName}`,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AdminService();

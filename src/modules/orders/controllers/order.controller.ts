import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service";
import { ApplicationException } from "../../../common";

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedData = req.body;
      const userId = req.user?.id;
      if (!userId) {
        return next(new ApplicationException("User authentication required", 401));
      }

      // Create order
      const order = await this.orderService.createOrderFromCart(validatedData, userId);

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  };

  getUserOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(new ApplicationException("User authentication required", 401));
      }

      const orders = await this.orderService.getUserOrders(userId);

      res.json({
        success: true,
        message: "Orders retrieved successfully",
        data: { orders }
      });
    } catch (error) {
      next(error);
    }
  };

  getOrderDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { orderId } = req.params;
      
      if (!orderId) {
        return next(new ApplicationException("Order ID is required", 400));
      }
      
      const userId = req.user?.id;
      if (!userId) {
        return next(new ApplicationException("User authentication required", 401));
      }

      // Verify ownership
      const isOwner = await this.orderService.verifyOrderOwnership(orderId, userId);
      if (!isOwner) {
        return next(new ApplicationException("Access denied", 403));
      }

      const order = await this.orderService.getOrderDetail(orderId);

      res.json({
        success: true,
        message: "Order details retrieved successfully",
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  };

  getOrderByNumber = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { orderNumber } = req.params;
      
      if (!orderNumber) {
        return next(new ApplicationException("Order number is required", 400));
      }
      
      const orderNum = parseInt(orderNumber);
      if (isNaN(orderNum)) {
        return next(new ApplicationException("Invalid order number", 400));
      }

      const order = await this.orderService.getOrderByNumber(orderNum);

      if (!order) {
        return next(new ApplicationException("Order not found", 404));
      }

      res.json({
        success: true,
        message: "Order retrieved successfully",
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  };

  updateOrderStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { orderId } = req.params;
      
      if (!orderId) {
        return next(new ApplicationException("Order ID is required", 400));
      }
      
      // Get validated data from middleware
      const validatedData = req.body;

      const order = await this.orderService.updateOrderStatus(
        orderId,
        validatedData.status,
        validatedData.changedBy,
        validatedData.notes
      );

      res.json({
        success: true,
        message: "Order status updated successfully",
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  };
}
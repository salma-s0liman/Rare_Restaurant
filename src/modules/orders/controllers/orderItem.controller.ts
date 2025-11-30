import { Request, Response, NextFunction } from "express";
import { OrderItemService } from "../services/orderItem.service";
import { ApplicationException } from "../../../common";

export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  getOrderItems = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const orderId = req.params.orderId?.trim();
      if (!orderId) {
        return next(new ApplicationException("Order ID is required", 400));
      }

      const items = await this.orderItemService.getOrderItems(orderId);

      res.json({
        success: true,
        message: "Order items retrieved successfully",
        data: { items }
      });
    } catch (error) {
      next(error);
    }
  };

  getOrderItemById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const itemId = req.params.itemId?.trim();
      if (!itemId) {
        return next(new ApplicationException("Order item ID is required", 400));
      }

      const item = await this.orderItemService.getOrderItemById(itemId);

      res.json({
        success: true,
        message: "Order item retrieved successfully",
        data: { item }
      });
    } catch (error) {
      next(error);
    }
  };

  calculateOrderTotal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const orderId = req.params.orderId?.trim();
      if (!orderId) {
        return next(new ApplicationException("Order ID is required", 400));
      }

      const total = await this.orderItemService.calculateOrderTotal(orderId);

      res.json({
        success: true,
        message: "Order total calculated successfully",
        data: { total }
      });
    } catch (error) {
      next(error);
    }
  };
}

import { Request, Response, NextFunction } from "express";
import { OrderStatusHistoryService } from "../services/orderStatusHistory.service";
import { ApplicationException } from "../../../common";

export class OrderStatusHistoryController {
  constructor(private readonly statusHistoryService: OrderStatusHistoryService) {}

  getOrderStatusHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const orderId = req.params.orderId?.trim();
      if (!orderId) {
        return next(new ApplicationException("Order ID is required", 400));
      }

      const statusHistory = await this.statusHistoryService.getOrderStatusHistory(orderId);

      res.json({
        success: true,
        message: "Order status history retrieved successfully",
        data: { statusHistory }
      });
    } catch (error) {
      next(error);
    }
  };

  getLatestStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const orderId = req.params.orderId?.trim();
      if (!orderId) {
        return next(new ApplicationException("Order ID is required", 400));
      }

      const latestStatus = await this.statusHistoryService.getLatestStatus(orderId);

      if (!latestStatus) {
        return next(new ApplicationException("No status history found", 404));
      }

      res.json({
        success: true,
        message: "Latest status retrieved successfully",
        data: { latestStatus }
      });
    } catch (error) {
      next(error);
    }
  };
}

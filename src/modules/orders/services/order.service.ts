import { AppDataSource } from "../../../DB/data-source";
import { OrdersRepository } from "../repositories/order.repository";
import { OrderItemRepository } from "../repositories/orderItem.repository";
import { OrderStatusHistoryRepository } from "../repositories/orderStatusHistory.repository";
import { Order } from "../../../DB/entity/order";
import { OrderItem } from "../../../DB/entity/orderItem";
import { OrderStatusHistory } from "../../../DB/entity/orderStatusHistory";
import type { Request, Response, NextFunction } from "express";

const ordersRepo = new OrdersRepository(AppDataSource.getRepository(Order));
const orderItemRepo = new OrderItemRepository(
  AppDataSource.getRepository(OrderItem)
);
const orderStatusHistoryRepo = new OrderStatusHistoryRepository(
  AppDataSource.getRepository(OrderStatusHistory)
);

class OrdersService {
  static createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    } catch (error) {
      next(error);
    }
  };
}

export default OrdersService;

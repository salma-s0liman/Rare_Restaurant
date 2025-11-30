import { Router } from "express";
import { DataSource, Repository } from "typeorm";

import { Order } from "../../DB/entity/order";
import { OrderItem } from "../../DB/entity/orderItem";
import { OrderStatusHistory } from "../../DB/entity/orderStatusHistory";
import { Cart } from "../../DB/entity/cart";
import { Address } from "../../DB/entity/address";

import { OrderRepository } from "./repositories/order.repository";
import { OrderItemRepository } from "./repositories/orderItem.repository";
import { OrderStatusHistoryRepository } from "./repositories/orderStatusHistory.repository";

import { OrderService } from "./services/order.service";
import { OrderItemService } from "./services/orderItem.service";
import { OrderStatusHistoryService } from "./services/orderStatusHistory.service";

import { OrderController } from "./controllers/order.controller";
import { OrderItemController } from "./controllers/orderItem.controller";
import { OrderStatusHistoryController } from "./controllers/orderStatusHistory.controller";

import { createOrderRouter } from "./routes/order.routes";
import { createOrderItemRouter } from "./routes/orderItem.routes";
import { createOrderStatusHistoryRouter } from "./routes/orderStatusHistory.routes";

/**
 * Orders Module
 * 
 * Complete order management module following Clean Architecture principles.
 * Handles order creation from carts, status tracking, and admin operations.
 */
export function OrdersModule(dataSource: DataSource): Router {
  // Repositories
  const orderRepo: Repository<Order> = dataSource.getRepository(Order);
  const orderItemRepo: Repository<OrderItem> = dataSource.getRepository(OrderItem);
  const orderStatusHistoryRepo: Repository<OrderStatusHistory> = dataSource.getRepository(OrderStatusHistory);
  const cartRepo: Repository<Cart> = dataSource.getRepository(Cart);
  const addressRepo: Repository<Address> = dataSource.getRepository(Address);

  // Custom repositories
  const orderRepository = new OrderRepository(orderRepo);
  const orderItemRepository = new OrderItemRepository(orderItemRepo);
  const statusHistoryRepository = new OrderStatusHistoryRepository(orderStatusHistoryRepo);

  // Services
  const orderService = new OrderService(
    orderRepository,
    orderItemRepository,
    statusHistoryRepository,
    cartRepo,
    addressRepo
  );
  const orderItemService = new OrderItemService(orderItemRepository);
  const statusHistoryService = new OrderStatusHistoryService(statusHistoryRepository);

  // Controllers
  const orderController = new OrderController(orderService);
  const orderItemController = new OrderItemController(orderItemService);
  const statusHistoryController = new OrderStatusHistoryController(statusHistoryService);

  // Routers
  const router = Router();

  // Mount sub-routers
  router.use("/", createOrderRouter(orderController));
  router.use("/", createOrderItemRouter(orderItemController));
  router.use("/", createOrderStatusHistoryRouter(statusHistoryController));

  return router;
}
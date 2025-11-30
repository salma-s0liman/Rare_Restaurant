import { Repository } from "typeorm";
import { Order } from "../../../DB/entity/order";
import { BaseRepository } from "../../../common/repositories/BaseRepository";
import { 
  BadRequestException,
  ApplicationException 
} from "../../../common";

export class OrderRepository extends BaseRepository<Order> {
  constructor(repo: Repository<Order>) {
    super(repo);
  }

  async findByIdWithRelations(id: string) {
    if (!id) {
      throw new BadRequestException("Order ID is required");
    }

    try {
      return this.findById(id, [
        "items",
        "items.menu_item",
        "restaurant",
        "user",
        "statusHistory",
        "statusHistory.changedBy",
        "address",
        "delivery",
        "delivery.driver"
      ]);
    } catch (error: any) {
      throw new ApplicationException(`Failed to find order: ${error.message}`);
    }
  }

  async findByOrderNumber(orderNumber: number) {
    if (!orderNumber) {
      throw new BadRequestException("Order number is required");
    }

    try {
      return this.findOne({
        where: { order_number: orderNumber },
        relations: ["items", "items.menu_item", "statusHistory", "restaurant", "user", "address"],
      });
    } catch (error: any) {
      throw new ApplicationException(`Failed to find order by number: ${error.message}`);
    }
  }

  async findByUserId(userId: string) {
    if (!userId) {
      throw new BadRequestException("User ID is required");
    }

    try {
      return this.findAll({
        where: { user: { id: userId } },
        relations: ["restaurant", "items", "items.menu_item"],
        order: { placed_at: "DESC" }
      });
    } catch (error: any) {
      throw new ApplicationException(`Failed to find user orders: ${error.message}`);
    }
  }

  async findByRestaurantId(restaurantId: string) {
    if (!restaurantId) {
      throw new BadRequestException("Restaurant ID is required");
    }

    try {
      return this.findAll({
        where: { restaurant: { id: restaurantId } },
        relations: ["user", "items", "items.menu_item", "delivery"],
        order: { placed_at: "DESC" }
      });
    } catch (error: any) {
      throw new ApplicationException(`Failed to find restaurant orders: ${error.message}`);
    }
  }

  async generateOrderNumber(): Promise<number> {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      // Find the last order number for today
      const lastOrder = await this.repo
        .createQueryBuilder("order")
        .where("order.placed_at >= :startOfDay", { startOfDay })
        .andWhere("order.placed_at < :endOfDay", { endOfDay })
        .orderBy("order.order_number", "DESC")
        .getOne();

      // Generate next number
      const datePrefix = parseInt(today.toISOString().slice(2, 10).replace(/-/g, "")); // YYMMDD
      const baseNumber = datePrefix * 10000; // YYMMDD0000

      if (!lastOrder) {
        return baseNumber + 1; // First order of the day
      }

      const lastNumber = lastOrder.order_number;
      const lastSequence = lastNumber % 10000; // Get last 4 digits
      return baseNumber + lastSequence + 1;
    } catch (error: any) {
      throw new ApplicationException(`Failed to generate order number: ${error.message}`);
    }
  }

  async verifyOwnership(orderId: string, userId: string): Promise<boolean> {
    if (!orderId || !userId) {
      throw new BadRequestException("Order ID and User ID are required");
    }
    
    try {
      const order = await this.repo.findOne({
        where: { id: orderId, user: { id: userId } }
      });
      
      return !!order;
    } catch (error: any) {
      throw new ApplicationException(`Failed to verify order ownership: ${error.message}`);
    }
  }
}

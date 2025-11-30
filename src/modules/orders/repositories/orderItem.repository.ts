// orderItem.repository.ts
import { Repository } from "typeorm";
import { OrderItem } from "../../../DB/entity/orderItem";
import { BaseRepository } from "../../../common/repositories/BaseRepository";
import { 
  BadRequestException,
  ApplicationException 
} from "../../../common";

export class OrderItemRepository extends BaseRepository<OrderItem> {
  constructor(repo: Repository<OrderItem>) {
    super(repo);
  }

  async findByOrder(orderId: string) {
    if (!orderId) {
      throw new BadRequestException("Order ID is required");
    }

    try {
      return this.findAll({ 
        where: { order: { id: orderId } },
        relations: ["menu_item", "menu_item.restaurant"] 
      });
    } catch (error: any) {
      throw new ApplicationException(`Failed to find order items: ${error.message}`);
    }
  }

  async createOrderItems(orderItems: Partial<OrderItem>[]): Promise<OrderItem[]> {
    if (!orderItems || orderItems.length === 0) {
      throw new BadRequestException("Order items are required");
    }

    try {
      const entities = this.repo.create(orderItems);
      return await this.repo.save(entities);
    } catch (error: any) {
      throw new ApplicationException(`Failed to create order items: ${error.message}`);
    }
  }

  async calculateOrderTotal(orderId: string): Promise<number> {
    if (!orderId) {
      throw new BadRequestException("Order ID is required");
    }

    try {
      const items = await this.findByOrder(orderId);
      return items.reduce((total: number, item: any) => 
        total + (Number(item.price_at_order) * item.quantity), 0);
    } catch (error: any) {
      throw new ApplicationException(`Failed to calculate order total: ${error.message}`);
    }
  }
}

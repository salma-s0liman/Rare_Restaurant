import { OrderItemRepository } from "../repositories/orderItem.repository";
import { 
  ApplicationException, 
  BadRequestException,
  NotFoundException
} from "../../../common";

export class OrderItemService {
  constructor(private orderItemRepo: OrderItemRepository) {}

  /**
   * Get order items by order ID
   */
  async getOrderItems(orderId: string) {
    if (!orderId) {
      throw new BadRequestException("Order ID is required");
    }

    try {
      return await this.orderItemRepo.findByOrder(orderId);
    } catch (error: any) {
      throw new ApplicationException(`Failed to get order items: ${error.message}`);
    }
  }

  /**
   * Calculate order total
   */
  async calculateOrderTotal(orderId: string): Promise<number> {
    if (!orderId) {
      throw new BadRequestException("Order ID is required");
    }

    try {
      return await this.orderItemRepo.calculateOrderTotal(orderId);
    } catch (error: any) {
      throw new ApplicationException(`Failed to calculate order total: ${error.message}`);
    }
  }

  /**
   * Get order item by ID
   */
  async getOrderItemById(itemId: string) {
    if (!itemId) {
      throw new BadRequestException("Order item ID is required");
    }

    try {
      const item = await this.orderItemRepo.findById(itemId);
      if (!item) {
        throw new NotFoundException("Order item not found");
      }
      return item;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ApplicationException(`Failed to get order item: ${error.message}`);
    }
  }
}
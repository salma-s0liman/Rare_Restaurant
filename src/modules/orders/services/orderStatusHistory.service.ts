import { OrderStatusHistoryRepository } from "../repositories/orderStatusHistory.repository";
import { 
  ApplicationException, 
  BadRequestException,
  NotFoundException 
} from "../../../common";
import { orderStatusEnum } from "../../../common/enums";
import { StatusHistoryDto } from "../dtos";

export class OrderStatusHistoryService {
  constructor(private statusHistoryRepo: OrderStatusHistoryRepository) {}

  /**
   * Get status history for an order
   */
  async getOrderStatusHistory(orderId: string): Promise<StatusHistoryDto[]> {
    if (!orderId) {
      throw new BadRequestException("Order ID is required");
    }

    try {
      const histories = await this.statusHistoryRepo.findByOrder(orderId);
      
      return histories.map((history: any) => ({
        id: history.id,
        previousStatus: history.previous_status as orderStatusEnum,
        newStatus: history.new_status as orderStatusEnum,
        changedAt: history.changed_at,
        changedBy: history.changedBy ? {
          id: history.changedBy.id,
          email: history.changedBy.email,
          firstName: history.changedBy.firstName,
          lastName: history.changedBy.lastName
        } : undefined,
        note: history.note
      }));
    } catch (error: any) {
      throw new ApplicationException(`Failed to get order status history: ${error.message}`);
    }
  }

  /**
   * Create status change record
   */
  async createStatusChange(data: {
    orderId: string;
    previousStatus?: string;
    newStatus: string;
    changedById?: string;
    note?: string;
  }) {
    try {
      return await this.statusHistoryRepo.createStatusChange(data);
    } catch (error: any) {
      throw new ApplicationException(`Failed to create status change: ${error.message}`);
    }
  }

  /**
   * Get latest status for an order
   */
  async getLatestStatus(orderId: string): Promise<StatusHistoryDto | null> {
    if (!orderId) {
      throw new BadRequestException("Order ID is required");
    }

    try {
      const histories = await this.statusHistoryRepo.findByOrder(orderId);
      
      if (histories.length === 0) {
        return null;
      }

      const latest = histories[0]; // Already sorted by created_at DESC
      
      if (!latest) {
        throw new NotFoundException("No status history found");
      }
      
      return {
        id: latest.id,
        previousStatus: latest.previous_status as orderStatusEnum,
        newStatus: latest.new_status as orderStatusEnum,
        changedAt: latest.created_at!,
        changedBy: latest.changedBy ? {
          id: latest.changedBy.id,
          email: latest.changedBy.email,
          firstName: latest.changedBy.firstName,
          lastName: latest.changedBy.lastName
        } : undefined,
        note: latest.note
      };
    } catch (error: any) {
      throw new ApplicationException(`Failed to get latest status: ${error.message}`);
    }
  }
}
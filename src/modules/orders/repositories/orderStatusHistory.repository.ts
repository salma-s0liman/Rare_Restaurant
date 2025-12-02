// orderStatusHistory.repository.ts
import { Repository } from "typeorm";
import { OrderStatusHistory } from "../../../DB/entity/orderStatusHistory";
import { BaseRepository } from "../../../common/repositories/BaseRepository";
import { BadRequestException, ApplicationException } from "../../../common";

export class OrderStatusHistoryRepository extends BaseRepository<OrderStatusHistory> {
  constructor(repo: Repository<OrderStatusHistory>) {
    super(repo);
  }

  async findByOrder(orderId: string) {
    if (!orderId) {
      throw new BadRequestException("Order ID is required");
    }

    try {
      return this.findAll({
        where: { order: { id: orderId } },
        relations: ["changedBy"],
        order: { created_at: "DESC" },
      });
    } catch (error: any) {
      throw new ApplicationException(
        `Failed to find order status history: ${error.message}`
      );
    }
  }

  async createStatusChange(data: {
    orderId: string;
    previousStatus?: string;
    newStatus: string;
    changedById?: string;
    note?: string;
  }) {
    try {
      const statusHistory: any = {
        order: { id: data.orderId },
        previous_status: data.previousStatus as any,
        new_status: data.newStatus as any,
        note: data.note,
      };

      if (data.changedById) {
        statusHistory.changedBy = { id: data.changedById };
      }

      // Use repo directly to avoid relation issues
      return await this.repo.save(statusHistory);
    } catch (error: any) {
      throw new ApplicationException(
        `Failed to create status history: ${error.message}`
      );
    }
  }
}

// orderStatusHistory.repository.ts
import { Repository } from "typeorm";
import { OrderStatusHistory } from "../../../DB/entity/orderStatusHistory";
import { BaseRepository } from "../../../common/repositories/BaseRepository";

export class OrderStatusHistoryRepository extends BaseRepository<OrderStatusHistory> {
  constructor(repo: Repository<OrderStatusHistory>) {
    super(repo);
  }

  async findByOrder(orderId: string) {
    return this.findAll({ where: { order: { id: orderId } } as any });
  }
}

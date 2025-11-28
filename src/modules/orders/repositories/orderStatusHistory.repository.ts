import { Repository } from "typeorm";
import { OrderStatusHistory } from "../../../DB/entity/orderStatusHistory";

export class OrderStatusHistoryRepository {
  constructor(private readonly repo: Repository<OrderStatusHistory>) {}

  async create(history: Partial<OrderStatusHistory>) {
    return this.repo.save(history);
  }

  async findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ["order", "changedBy"],
    });
  }

  async findAll(options = {}) {
    return this.repo.find(options);
  }

  async findByOrder(orderId: string) {
    return this.repo.find({
      where: { order: { id: orderId } },
      relations: ["order", "changedBy"],
    });
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}

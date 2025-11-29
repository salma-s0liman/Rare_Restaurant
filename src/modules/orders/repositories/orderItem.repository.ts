// orderItem.repository.ts
import { Repository } from "typeorm";
import { OrderItem } from "../../../DB/entity/orderItem";
import { BaseRepository } from "../../../common/repositories/BaseRepository";

export class OrderItemRepository extends BaseRepository<OrderItem> {
  constructor(repo: Repository<OrderItem>) {
    super(repo);
  }

  async findByOrder(orderId: string) {
    return this.findAll({ where: { order: { id: orderId } } as any, relations: ["menu_item"] });
  }
}

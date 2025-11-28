import { Repository } from "typeorm";
import { OrderItem } from "../../../DB/entity/orderItem";

export class OrderItemRepository {
  constructor(private readonly repo: Repository<OrderItem>) {}

  async create(orderItem: Partial<OrderItem>) {
    return this.repo.save(orderItem);
  }

  async findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ["order", "menu_item"],
    });
  }

  async findAll(options = {}) {
    return this.repo.find(options);
  }

  async update(id: string, data: Partial<OrderItem>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}

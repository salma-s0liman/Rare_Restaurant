import {  Repository } from "typeorm";
import { Order } from "../../../DB/entity/order";
import { BaseRepository } from "../../..//common/repositories/BaseRepository";

export class OrderRepository extends BaseRepository<Order> {
  constructor(repo: Repository<Order>) {
    super(repo);
  }

  async findByIdWithRelations(id: string) {
    return this.findById(id, [
      "items",
      "items.menu_item",
      "restaurant",
      "user",
      "statusHistory",
    ]);
  }

  async findByOrderNumber(orderNumber: string) {
    return this.findOne({
      where: { order_number: orderNumber } as any,
      relations: ["items", "statusHistory", "restaurant", "user"],
    });
  }
}

import { Repository, FindOptionsWhere, FindManyOptions } from "typeorm";
import { Order } from "../../../DB/entity/order";

export class OrdersRepository {
  private repo: Repository<Order>;
  constructor(repo: Repository<Order>) {
    this.repo = repo;
  }

  async create(order: Partial<Order>) {
    // Use .create for entity instantiation, .save for persistence
    const entity = this.repo.create(order);
    return this.repo.save(entity);
  }

  async findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: [
        "items",
        "statusHistory",
        "user",
        "restaurant",
        "address",
        "delivery",
        "ratingsReviews",
      ],
    });
  }

  async findAll(options?: FindManyOptions<Order>) {
    return this.repo.find(options);
  }

  async find(where: FindOptionsWhere<Order>) {
    return this.repo.find({ where });
  }

  async update(id: string, data: Partial<Order>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}

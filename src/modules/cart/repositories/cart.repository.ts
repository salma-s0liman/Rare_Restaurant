import { Repository, FindOptionsWhere, FindManyOptions } from "typeorm";
import { Cart } from "../../../DB/entity/cart";

export class CartRepository {
  private repo: Repository<Cart>;
  constructor(repo: Repository<Cart>) {
    this.repo = repo;
  }

  async create(cart: Partial<Cart>) {
    const entity = this.repo.create(cart);
    return this.repo.save(entity);
  }

  async findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ["cart_items", "cart_items.menuItem", "restaurant", "user"],
    });
  }

  async findAll(options?: FindManyOptions<Cart>) {
    return this.repo.find(options);
  }

  async find(where: FindOptionsWhere<Cart>) {
    return this.repo.find({ where });
  }

  async update(id: string, data: Partial<Cart>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}

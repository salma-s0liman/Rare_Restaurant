import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
} from "typeorm";
import { Cart } from "../../../DB/entity/cart";


export class CartRepository {
  private repo: Repository<Cart>;

  constructor(repo: Repository<Cart>) {
    this.repo = repo;
  }

  /** Create and save a new cart */
  async create(data: Partial<Cart>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  /** Find cart by ID with full relations */
  async findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: [
        "cart_items",
        "cart_items.menuItem",
        "restaurant",
        "user",
      ],
    });
  }

  /** Generic findOne (used in CartService for duplicate cart detection) */
  async findOne(where: FindOptionsWhere<Cart>) {
    return this.repo.findOne({
      where,
      relations: ["restaurant", "user", "cart_items", "cart_items.menuItem"],
    });
  }

  /** Find all carts */
  async findAll(options?: FindManyOptions<Cart>) {
    return this.repo.find(options);
  }

  /** Raw where search without relations */
  async find(where: FindOptionsWhere<Cart>) {
    return this.repo.find({ where });
  }

  /** Update cart and return full hydrated version */
  async update(id: string, data: Partial<Cart>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  /** Delete cart */
  async delete(id: string) {
    return this.repo.delete(id);
  }
}

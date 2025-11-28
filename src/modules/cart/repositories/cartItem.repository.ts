import { Repository, FindOptionsWhere, FindManyOptions } from "typeorm";
import { CartItem } from "../../../DB/entity/cartItems";

export class CartItemRepository {
  private repo: Repository<CartItem>;
  
  constructor(repo: Repository<CartItem>) {
    this.repo = repo;
  }

  /** Create and save a new cart item */
  async create(data: Partial<CartItem>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  /** Find cart item by ID with relations */
  async findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ["cart", "menuItem"],
    });
  }

  /** Find all cart items by options */
  async findAll(options?: FindManyOptions<CartItem>) {
    return this.repo.find(options);
  }

  /** Find cart items by conditions */
  async find(where: FindOptionsWhere<CartItem>) {
    return this.repo.find({ where });
  }

  /** Find single cart item by conditions */
  async findOne(where: FindOptionsWhere<CartItem>) {
    return this.repo.findOne({
      where,
      relations: ["cart", "menuItem"],
    });
  }

  /** Update cart item (e.g., change quantity) */
  async update(id: string, data: Partial<CartItem>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  /** Delete cart item */
  async delete(id: string) {
    return this.repo.delete(id);
  }

  /** Delete all items in a cart */
  async deleteByCart(cartId: string) {
    return this.repo.delete({ cart: { id: cartId } });
  }

  /** Find if cart already contains specific menuItem */
  async findByCartAndMenuItem(cartId: string, menuItemId: string) {
    return this.repo.findOne({
      where: {
        cart: { id: cartId },
        menuItem: { id: menuItemId },
      },
      relations: ["cart", "menuItem"],
    });
  }

  /** Get all items for a given cart */
  async findCartItems(cartId: string) {
    return this.repo.find({
      where: { cart: { id: cartId } },
      relations: ["menuItem"],
    });
  }
}

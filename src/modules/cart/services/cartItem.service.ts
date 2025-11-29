import { CartItemRepository } from "./../repositories/cartItem.repository";
import { CartRepository } from "./../repositories/cart.repository";
import { MenuItem } from "../../../DB/entity/menuItem";
import { Repository } from "typeorm";
import { NotFoundException } from "../../../common/utils";

export class CartItemService {
  constructor(
    private cartItemRepo: CartItemRepository,
    private cartRepo: CartRepository,
    private menuRepo: Repository<MenuItem>
  ) {}

  async addItem(cartId: string, menuItemId: string, quantity: number) {
    const cart = await this.cartRepo.findById(cartId);
    if (!cart) throw new NotFoundException("Cart not found");

    const menu = await this.menuRepo.findOne({ where: { id: menuItemId } });
    if (!menu) throw new NotFoundException("Menu item not found");

    const existing = await this.cartItemRepo.findByCartAndMenuItem(
      cartId,
      menuItemId
    );

    if (existing) {
      existing.quantity += quantity;
      return this.cartItemRepo.update(existing.id, {
        quantity: existing.quantity,
      });
    }

    return this.cartItemRepo.create({
      cart,
      menuItem: menu,
      quantity,
      priceAtAdd: menu.price,
    });
  }

  async updateItem(cartItemId: string, quantity: number) {
    const cartItem = await this.cartItemRepo.findById(cartItemId);
    if (!cartItem) throw new NotFoundException("Cart item not found");

    return this.cartItemRepo.update(cartItemId, { quantity });
  }

  async removeItem(cartItemId: string) {
    const cartItem = await this.cartItemRepo.findById(cartItemId);
    if (!cartItem) throw new NotFoundException("Cart item not found");

    await this.cartItemRepo.delete(cartItemId);
    return true;
  }
}

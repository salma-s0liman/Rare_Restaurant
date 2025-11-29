import { Repository } from "typeorm";
import { Restaurant } from "../../../DB/entity/restaurant";
import { CartRepository } from "./../repositories/cart.repository";
import { ApplicationException, NotFoundException } from "../../../common/utils";

export class CartService {
  constructor(
    private cartRepo: CartRepository,
    private restaurantRepo: Repository<Restaurant>
  ) {}

  async createCart(restaurantId: string, user: any) {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException("Restaurant not found");

    if (user) {
      const existingCart = await this.cartRepo.findOne({
        user: { id: user.id },
        restaurant: { id: restaurantId },
      });

      if (existingCart) {
        throw new ApplicationException(
          "You already have a cart for this restaurant.",
          400
        );
      }
    }

    const cart = await this.cartRepo.create({
      restaurant,
      user: user ? ({ id: user.id } as any) : undefined,
    });

    return this.cartRepo.findById(cart.id);
  }

  async getCart(cartId: string) {
    const cart = await this.cartRepo.findById(cartId);
    if (!cart) throw new NotFoundException("Cart not found");
    return cart;
  }

  async deleteCart(cartId: string) {
    const cart = await this.cartRepo.findById(cartId);
    if (!cart) throw new NotFoundException("Cart not found");
    await this.cartRepo.delete(cartId);
    return true;
  }
}

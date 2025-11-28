import { AppDataSource } from "../../DB/data-source";
import { Cart } from "../../DB/entity/cart";

import { Restaurant } from "../../DB/entity/restaurant";
import { Repository } from "typeorm";
import { ApplicationException, NotfoundException } from "../../common/utils/";
import type { Request, Response, NextFunction } from "express";

const cartRepo: Repository<Cart> = AppDataSource.getRepository(Cart);
const restaurantRepo: Repository<Restaurant> =
  AppDataSource.getRepository(Restaurant);

class CartService {
  static createCart = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { restaurantId } = req.params;
      const user = req.user;

      const restaurant = await restaurantRepo.findOne({
        where: { id: restaurantId },
      });
      if (!restaurant) throw new NotfoundException("Restaurant not found");

      if (user) {
        const existingCart = await cartRepo.findOne({
          where: { user: { id: user.id }, restaurant: { id: restaurantId } },
        });
        if (existingCart) {
          return res.status(400).json({
            message:
              "You already have a cart for this restaurant. Please checkout or delete it before creating a new one.",
            cart: existingCart,
          });
        }
      }

      const cart = cartRepo.create({
        restaurant,
        user: user ? { id: user.id } : undefined,
      });
      await cartRepo.save(cart);

      const result = await cartRepo.findOne({
        where: { id: cart.id },
        relations: ["cart_items", "cart_items.menuItem", "restaurant", "user"],
      });

      return res
        .status(201)
        .json({ message: "Cart created successfully", cart: result });
    } catch (error) {
      throw new ApplicationException("Failed to create cart", 500, error);
    }
  };
}

export default CartService;

import type { Request, Response, NextFunction } from "express";
import { CartService } from "./../services/cart.service";

export class CartController {
  constructor(private cartService: CartService) {}

  createCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { restaurantId } = req.params;
      const user = req.user;

      if (!restaurantId) {
        res.status(400).json({ message: "restaurantId is required" });
        return;
      }

      const cart = await this.cartService.createCart(restaurantId, user);

      res.status(201).json({
        message: "Cart created successfully",
        cart,
      });
    } catch (err) {
      next(err);
    }
  };

  getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartId } = req.params;

      if (!cartId) {
        res.status(400).json({ message: "cartId is required" });
        return;
      }

      const cart = await this.cartService.getCart(cartId);
      res.json(cart);
    } catch (err) {
      next(err);
    }
  };

  deleteCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartId } = req.params;

      if (!cartId) {
        res.status(400).json({ message: "cartId is required" });
        return;
      }

      await this.cartService.deleteCart(cartId);
      res.json({ message: "Cart deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}

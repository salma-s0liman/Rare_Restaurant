import type { Request, Response, NextFunction } from "express";
import { CartItemService } from "../services/cartItem.service";

export class CartItemController {
  constructor(private cartItemService: CartItemService) {}

  addItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const cartId = req.params.cartId!;
      const { menuItemId, quantity } = req.body;

      const item = await this.cartItemService.addItem(
        cartId,
        menuItemId,
        quantity
      );

        res.status(201).json({
        message: "Item added to cart",
        item,
      });
    } catch (err) {
      return next(err);
    }
  };

  updateItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const cartItemId = req.params.cartItemId!;
      const { quantity } = req.body;

      const item = await this.cartItemService.updateItem(
        cartItemId,
        quantity
      );

        res.json({
        message: "Cart item updated",
        item,
      });
    } catch (err) {
      return next(err);
    }
  };

  deleteItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const cartItemId = req.params.cartItemId!;

      await this.cartItemService.removeItem(cartItemId);

        res.json({
        message: "Cart item removed",
      });
    } catch (err) {
      return next(err);
    }
  };
}

import { Request, Response } from "express";
import { MenuItemService } from "../services/menuItem.service";

export class MenuItemController {
  constructor(private menuItemService: MenuItemService) {}

  createMenuItem = async (req: Request, res: Response) => {
    const restaurantId = req.params.restaurantId;

    if (!restaurantId) {
      res.status(400).json({ error: "restaurantId is required" });
      return;
    }

    const result = await this.menuItemService.createMenuItem({
      ...req.body,
      restaurant: { id: restaurantId }
    });

    res.json(result);
  };

  getMenuItems = async (req: Request, res: Response) => {
    const restaurantId = req.params.restaurantId;

    if (!restaurantId) {
      res.status(400).json({ error: "restaurantId is required" });
      return;
    }

    const result = await this.menuItemService.getMenuItems(restaurantId);
    res.json(result);
  };

  updateMenuItem = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ error: "menu item id is required" });
      return;
    }

    const result = await this.menuItemService.updateMenuItem(id, req.body);
    res.json(result);
  };

  deleteMenuItem = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ error: "menu item id is required" });
      return;
    }

    const success = await this.menuItemService.deleteMenuItem(id);
    res.json({ success });
  };

  // MENU ITEM IMAGES
  addImage = async (req: Request, res: Response) => {
    const menuItemId = req.params.menuItemId;

    if (!menuItemId) {
      res.status(400).json({ error: "menuItemId is required" });
      return;
    }

    const result = await this.menuItemService.addImage(menuItemId, req.body);
    res.json(result);
  };

  getImages = async (req: Request, res: Response) => {
    const menuItemId = req.params.menuItemId;

    if (!menuItemId) {
      res.status(400).json({ error: "menuItemId is required" });
      return;
    }

    const result = await this.menuItemService.getImages(menuItemId);
    res.json(result);
  };
}

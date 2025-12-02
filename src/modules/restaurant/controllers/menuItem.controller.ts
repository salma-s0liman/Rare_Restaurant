import { Request, Response, NextFunction } from "express";
import { MenuItemService } from "../services/menuItem.service";

export class MenuItemController {
  constructor(private menuItemService: MenuItemService) {}

  createMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.params.restaurantId!;
      const userId = req.user!.id;

      const result = await this.menuItemService.createMenuItem(
        {
          ...req.body,
          restaurantId,
          restaurant: { id: restaurantId },
        },
        userId
      );

      res.status(201).json({
        success: true,
        message: "Menu item created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getMenuItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.params.restaurantId!;
      const categoryId = req.query.categoryId as string | undefined;
      const result = await this.menuItemService.getMenuItems(
        restaurantId,
        categoryId
      );
      res.json({
        success: true,
        message: "Menu items retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!;
      const userId = req.user!.id;
      const result = await this.menuItemService.updateMenuItem(
        id,
        req.body,
        userId
      );
      res.json({
        success: true,
        message: "Menu item updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!;
      const userId = req.user!.id;
      const success = await this.menuItemService.deleteMenuItem(id, userId);
      res.json({
        success,
        message: success
          ? "Menu item deleted successfully"
          : "Failed to delete menu item",
      });
    } catch (error) {
      next(error);
    }
  };

  // MENU ITEM IMAGES
  addImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const menuItemId = req.params.menuItemId!;
      const userId = req.user!.id;
      const result = await this.menuItemService.addImage(
        menuItemId,
        req.body,
        userId
      );
      res.status(201).json({
        success: true,
        message: "Image added successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const menuItemId = req.params.menuItemId!;
      const result = await this.menuItemService.getImages(menuItemId);
      res.json({
        success: true,
        message: "Images retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imageId = req.params.imageId!;
      const userId = req.user!.id;
      const result = await this.menuItemService.updateImage(
        imageId,
        req.body,
        userId
      );
      res.json({
        success: true,
        message: "Image updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imageId = req.params.imageId!;
      const userId = req.user!.id;
      const result = await this.menuItemService.deleteImage(imageId, userId);
      res.json({
        success: result,
        message: result
          ? "Image deleted successfully"
          : "Failed to delete image",
      });
    } catch (error) {
      next(error);
    }
  };
}

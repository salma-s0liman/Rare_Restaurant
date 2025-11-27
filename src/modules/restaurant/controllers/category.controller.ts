import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  createCategory = async (req: Request, res: Response) => {
    const result = await this.categoryService.createCategory(req.body);
    res.json(result);
  };

  getCategories = async (req: Request, res: Response) => {
    const restaurantId = req.params.restaurantId;

    if (!restaurantId) {
      res.status(400).json({ error: "restaurantId is required" });
      return;
    }

    const result = await this.categoryService.getCategories(restaurantId);
    res.json(result);
  };

  updateCategory = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ error: "Category ID is required" });
      return;
    }

    const result = await this.categoryService.updateCategory(id, req.body);
    res.json(result);
  };

  deleteCategory = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ error: "Category ID is required" });
      return;
    }

    const result = await this.categoryService.deleteCategory(id);
    res.json({ success: result });
  };
}

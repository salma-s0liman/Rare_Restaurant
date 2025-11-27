import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.categoryService.createCategory(req.body);
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.params.restaurantId!;
      const result = await this.categoryService.getCategories(restaurantId);
      res.json({
        success: true,
        message: "Categories retrieved successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!;
      const result = await this.categoryService.updateCategory(id, req.body);
      res.json({
        success: true,
        message: "Category updated successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!;
      const result = await this.categoryService.deleteCategory(id);
      res.json({ 
        success: result, 
        message: result ? "Category deleted successfully" : "Failed to delete category"
      });
    } catch (error) {
      next(error);
    }
  };
}

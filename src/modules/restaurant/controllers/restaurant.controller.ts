import { Request, Response, NextFunction } from "express";
import { RestaurantService } from "../services/restaurant.service";

export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  createRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.restaurantService.createRestaurant(
        req.body,
        req.user!.id
      );
      res.status(201).json({
        success: true,
        message: "Restaurant created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllRestaurants = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.restaurantService.getAllRestaurants();
      res.json({
        success: true,
        message: "Restaurants retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getRestaurantById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id!;
      const result = await this.restaurantService.getRestaurantById(id);
      res.json({
        success: true,
        message: "Restaurant retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id!;
      const result = await this.restaurantService.updateRestaurant(
        id,
        req.body
      );
      res.json({
        success: true,
        message: "Restaurant updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id!;
      const success = await this.restaurantService.deleteRestaurant(id);
      res.json({
        success,
        message: success
          ? "Restaurant deleted successfully"
          : "Failed to delete restaurant",
      });
    } catch (error) {
      next(error);
    }
  };
}

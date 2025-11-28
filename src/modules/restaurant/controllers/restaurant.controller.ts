import { Request, Response, NextFunction } from "express";
import { RestaurantService } from "../services/restaurant.service";

export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

<<<<<<< HEAD
  createRestaurant = async (req: Request, res: Response) => {
    // DEBUG: Log who is creating the restaurant
    console.log("🏪 Creating restaurant - User info:", {
      id: req.user!.id,
      email: req.user!.email,
      firstName: req.user!.firstName,
      lastName: req.user!.lastName,
    });

    const result = await this.restaurantService.createRestaurant(
      req.body,
      req.user!.id
    );
    res.json(result);
  };

  getAllRestaurants = async (req: Request, res: Response) => {
    const result = await this.restaurantService.getAllRestaurants();
    res.json(result);
  };

  getRestaurantById = async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Restaurant ID is required" });
=======
  createRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.restaurantService.createRestaurant(req.body);
      res.status(201).json({
        success: true,
        message: "Restaurant created successfully",
        data: result
      });
    } catch (error) {
      next(error);
>>>>>>> 32c787ef53cfd737a70c4bc5b25570e7e17d26b5
    }
  };

<<<<<<< HEAD
  updateRestaurant = async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Restaurant ID is required" });
=======
  getAllRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.restaurantService.getAllRestaurants();
      res.json({
        success: true,
        message: "Restaurants retrieved successfully",
        data: result
      });
    } catch (error) {
      next(error);
>>>>>>> 32c787ef53cfd737a70c4bc5b25570e7e17d26b5
    }
  };

<<<<<<< HEAD
  deleteRestaurant = async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Restaurant ID is required" });
=======
  getRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!;
      const result = await this.restaurantService.getRestaurantById(id);
      res.json({
        success: true,
        message: "Restaurant retrieved successfully",
        data: result
      });
    } catch (error) {
      next(error);
>>>>>>> 32c787ef53cfd737a70c4bc5b25570e7e17d26b5
    }
  };

  updateRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!;
      const result = await this.restaurantService.updateRestaurant(id, req.body);
      res.json({
        success: true,
        message: "Restaurant updated successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  deleteRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!;
      const success = await this.restaurantService.deleteRestaurant(id);
      res.json({ 
        success, 
        message: success ? "Restaurant deleted successfully" : "Failed to delete restaurant"
      });
    } catch (error) {
      next(error);
    }
  };
}

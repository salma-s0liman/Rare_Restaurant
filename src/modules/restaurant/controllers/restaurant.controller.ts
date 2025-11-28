import { Request, Response } from "express";
import { RestaurantService } from "../services/restaurant.service";

export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

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
    }

    const result = await this.restaurantService.getRestaurantById(id);
    res.json(result);
  };

  updateRestaurant = async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Restaurant ID is required" });
    }

    const result = await this.restaurantService.updateRestaurant(id, req.body);
    res.json(result);
  };

  deleteRestaurant = async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Restaurant ID is required" });
    }

    const success = await this.restaurantService.deleteRestaurant(id);
    res.json({ success });
  };
}

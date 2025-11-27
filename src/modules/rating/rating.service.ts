import { Request, Response, NextFunction } from "express";
import { AdminResponseDto } from "./rating.dto";
import {
  ApplicationException,
  BadRequestException,
  NotfoundException,
} from "../../common";
import {
  ratingRepository,
  reviewResponseRepository,
} from "./rating.repository";

class RatingService {

  constructor() {}

  // =================================================================
  // 1. Submit Rating (Customer)
  // =================================================================

  // =================================================================
  // 2. Update Rating (Customer)
  // =================================================================

  // =================================================================
  // 3. Get My Reviews (Customer)
  // =================================================================

  // =================================================================
  // 4. Get Restaurant Reviews (Public)
  getRestaurantReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { restaurantId } = req.params;

      if (!restaurantId) {
        throw new ApplicationException("Restaurant ID is required", 400);
      }
      const reviews = await ratingRepository.findByRestaurantId(restaurantId);
      return res.status(200).json({
        data: reviews,
      });
    } catch (error) {
      return next(error);
    }
  };

  // =================================================================
  // 5. Respond to Review (Admin)
  respondToReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user!.id;
      const { ratingId } = req.params;
      const { responseText } = req.body as AdminResponseDto;

      if (!ratingId) {
        throw new ApplicationException("Rating ID is required", 400);
      }

      const review = await ratingRepository.findOne({
        where: { id: ratingId },
      });
      if (!review) throw new NotfoundException("Review not found");

      const existingResponse = await ratingRepository.findOne({
        where: { id: ratingId },
      });
      if (existingResponse) {
        throw new BadRequestException("This review already has a response");
      }

      const response = await reviewResponseRepository.create({
        rating_id: ratingId,
        responder_id: adminId,
        response_text: responseText,
      });

      return res.status(201).json({
        message: "Response added",
        data: response,
      });
    } catch (error) {
      return next(error);
    }
  };
}

export default new RatingService();

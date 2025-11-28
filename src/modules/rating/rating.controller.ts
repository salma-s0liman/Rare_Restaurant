import { Router } from "express";
import { auth, userRoleEnum, validation } from "../../common";
import ratingService from "./rating.service";
import {
  adminResponseValidation,
  createRatingValidation,
  getRestaurantReviewsValidation,
  updateRatingValidation,
} from "./rating.validation";

const router = Router();

// 1. Submit Rating
// Validates params.orderId AND body content
router.post(
  "/orders/:orderId/ratings",
  auth([userRoleEnum.customer]),
  validation(createRatingValidation)
  // controller.submitRating
);

// 2. Edit Rating
router.put(
  "/ratings/:id",
  auth([userRoleEnum.customer]),
  validation(updateRatingValidation)
  // controller.editRating
);

// 3. Get Reviews (Public)
// Validates params.restaurantId AND query.page/limit
router.get(
  "/restaurants/:restaurantId/ratings",
  validation(getRestaurantReviewsValidation)
  //controller.getRestaurantReviews
);

// 4. Admin Response
router.post(
  "/admin/ratings/:ratingId/response",
  auth(),
  validation(adminResponseValidation),
  ratingService.respondToReview
);

export default router;

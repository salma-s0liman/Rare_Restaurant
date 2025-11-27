import { BaseRepository } from "../../common";
import { RatingReview, ReviewResponse } from "../../DB";
import { AppDataSource } from "../../DB/data-source";

// 1. Rating Repository
class RatingRepository extends BaseRepository<RatingReview> {
  constructor() {
    super(AppDataSource.getRepository(RatingReview));
  }

  // Custom method: Check if this item in this order is already reviewed
  // This helps prevent a user from rating the same burger twice for the same order
  async findByOrderAndItem(
    orderId: string,
    menuItemId: string
  ): Promise<RatingReview | null> {
    return this.repo.findOne({
      where: {
        order_id: orderId,
        menu_item_id: menuItemId,
      },
    });
  }

  // Custom method: Find all reviews for a specific restaurant
  // Since RatingReview is linked to MenuItem, we query through that relationship
  async findByRestaurantId(restaurantId: string): Promise<RatingReview[]> {
    return this.repo.find({
      where: {
        menuItem: { restaurant: { id: restaurantId } }, 
        is_visible: true,
      },
      relations: ["user", "menuItem", "responses", "responses.responder"], // Load User, Food info, Admin replies, and Admin info
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
        },
        responses: {
          id: true,
          response_text: true,
          created_at: true,
          responder: {
            firstName: true,
            lastName: true,
          },
        },
      } as any, // 'as any' sometimes needed for complex nested selects in TypeORM strict mode
      order: { created_at: "DESC" },
    });
  }

  // Custom Method: Get average rating for a menu item
  async getAverageRating(menuItemId: string): Promise<number> {
    const { avg } = await this.repo
      .createQueryBuilder("review")
      .select("AVG(review.rating)", "avg")
      .where("review.menu_item_id = :id", { id: menuItemId })
      .andWhere("review.is_visible = :visible", { visible: true })
      .getRawOne();

    return parseFloat(avg) || 0;
  }
}

// 2. Response Repository (for Admin replies)
class ReviewResponseRepository extends BaseRepository<ReviewResponse> {
  constructor() {
    super(AppDataSource.getRepository(ReviewResponse));
  }

  async findByRatingId(ratingId: string): Promise<ReviewResponse | null> {
    return this.repo.findOne({
      where: { rating_id: ratingId },
      relations: ["responder"],
    });
  }
}

export const ratingRepository = new RatingRepository();
export const reviewResponseRepository = new ReviewResponseRepository();

import { z } from "zod";

// --- 1. Create Rating ---
// Route: POST /orders/:orderId/ratings
export const createRatingValidation = {
  params: z.object({
    orderId: z.uuid({ message: "Invalid Order ID" }),
  }),
  // Validate JSON Body
  body: z.object({
    menuItemId: z.uuid({ message: "Invalid Menu Item ID" }),
    rating: z
      .number()
      .int()
      .min(1)
      .max(5, { message: "Rating must be between 1 and 5" }),
    review_text: z.string().optional(),
    is_visible: z.boolean().optional(),
  }),
};

// --- 2. Update Rating ---
// Route: PUT /ratings/:id
export const updateRatingValidation = {
  params: z.object({
    id: z.uuid({ message: "Invalid Review ID" }),
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    review_text: z.string().optional(),
  }),
};

// --- 3. Get Restaurant Reviews ---
// Route: GET /restaurants/:restaurantId/ratings
export const getRestaurantReviewsValidation = {
  params: z.object({
    restaurantId: z.uuid({ message: "Invalid Restaurant ID" }),
  }),
  // Validate Query Strings (e.g. ?page=1&limit=10)
  // We use z.coerce because query params always come as strings
  query: z.object({
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(50).default(10).optional(),
  }),
};

// --- 4. Admin Response ---
// Route: POST /admin/ratings/:ratingId/response
export const adminResponseValidation = {
  params: z.object({
    ratingId: z.uuid({ message: "Invalid Rating ID" }),
  }),
  body: z.object({
    responseText: z.string().min(1, { message: "Response cannot be empty" }),
  }),
};


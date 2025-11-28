import { z } from "zod";

export const createCart = {
  params: z.object({
    restaurantId: z.string().uuid(),
  }),
};



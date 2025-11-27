import z from "zod";
import * as validators from "./rating.validation";

export type CreateRatingDto = z.infer<typeof validators.createRatingValidation.body>;
export type UpdateRatingDto = z.infer<typeof validators.updateRatingValidation.body>;
export type AdminResponseDto = z.infer<typeof validators.adminResponseValidation.body>;
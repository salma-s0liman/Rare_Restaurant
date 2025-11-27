import { Response } from "express";
import { ISuccessResponse } from "../../interfaces/response.interface";

export const successResponse = <T = any>(
  res: Response,
  data?: T,
  message: string = "Success",
  statusCode: number = 200,
  pagination?: ISuccessResponse<T>["pagination"]
): Response<ISuccessResponse<T>> => {
  const response: ISuccessResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};


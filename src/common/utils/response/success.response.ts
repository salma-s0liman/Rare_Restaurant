import { Response } from "express";

export interface ISuccessResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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

export const errorResponse = (
  res: Response,
  message: string = "Something went wrong",
  statusCode: number = 500,
  errors?: any
): Response => {
  const response = {
    success: false,
    message,
    errors,
  };

  return res.status(statusCode).json(response);
};

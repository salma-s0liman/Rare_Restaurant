import { z } from "zod";

// Get user profile response
export const UserProfileResponseSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  gender: z.string().nullable(),
  role: z.string(),
  profilePicture: z.string().nullable(),
  vehicle_info: z.string().nullable(),
  is_active: z.boolean(),
  createdAt: z.date(),
  lastLoginAt: z.date().nullable()
});

// User stats response
export const UserStatsResponseSchema = z.object({
  totalOrders: z.number(),
  totalAddresses: z.number(),
  totalReviews: z.number(),
  memberSince: z.date(),
  lastLogin: z.date().nullable()
});

// User preferences response
export const UserPreferencesResponseSchema = z.object({
  language: z.string(),
  currency: z.string()
});

// Search users response
export const SearchUsersResponseSchema = z.object({
  users: z.array(UserProfileResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
});

// Success response
export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
});

export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
export type UserStatsResponse = z.infer<typeof UserStatsResponseSchema>;
export type UserPreferencesResponse = z.infer<typeof UserPreferencesResponseSchema>;
export type SearchUsersResponse = z.infer<typeof SearchUsersResponseSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
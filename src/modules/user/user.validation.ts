import { z } from "zod";
import { userRoleEnum } from "../../common/enums";

// Profile update schema
export const UpdateUserProfileSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .optional(),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .optional(),
  phone: z.string()
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must not exceed 20 digits")
    .optional(),
  gender: z.enum(["male", "female", "other"])
    .optional(),
  vehicle_info: z.string()
    .max(255, "Vehicle info must not exceed 255 characters")
    .optional()
    .nullable()
});

// Change password schema
export const ChangePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  confirmPassword: z.string()
    .min(1, "Confirm password is required")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// User preferences schema
export const UserPreferencesSchema = z.object({
  language: z.enum(["en", "ar"]).optional(),
  currency: z.enum(["USD", "EUR", "GBP", "SAR"]).optional()
});

// Profile picture upload schema
export const ProfilePictureSchema = z.object({
  profilePicture: z.string()
    .url("Invalid profile picture URL")
    .optional()
    .nullable()
});

// Account deactivation schema
export const DeactivateAccountSchema = z.object({
  password: z.string()
    .min(1, "Password is required for account deactivation"),
  reason: z.string()
    .min(5, "Please provide a reason for deactivation")
    .max(500, "Reason must not exceed 500 characters")
    .optional()
});

// Search users schema
export const SearchUsersSchema = z.object({
  searchTerm: z.string()
    .min(2, "Search term must be at least 2 characters"),
  role: z.nativeEnum(userRoleEnum).optional(),
  page: z.number()
    .int()
    .positive()
    .default(1),
  limit: z.number()
    .int()
    .positive()
    .max(100)
    .default(10)
});

// Update role schema (admin only)
export const UpdateUserRoleSchema = z.object({
  userId: z.string()
    .uuid("Invalid user ID"),
  newRole: z.nativeEnum(userRoleEnum)
});

export type UpdateUserProfileType = z.infer<typeof UpdateUserProfileSchema>;
export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;
export type UserPreferencesType = z.infer<typeof UserPreferencesSchema>;
export type ProfilePictureType = z.infer<typeof ProfilePictureSchema>;
export type DeactivateAccountType = z.infer<typeof DeactivateAccountSchema>;
export type SearchUsersType = z.infer<typeof SearchUsersSchema>;
export type UpdateUserRoleType = z.infer<typeof UpdateUserRoleSchema>;
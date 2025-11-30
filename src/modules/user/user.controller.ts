import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { 
  UpdateUserProfileSchema,
  ChangePasswordSchema,
  UserPreferencesSchema,
  ProfilePictureSchema,
  DeactivateAccountSchema,
  SearchUsersSchema
} from "./user.validation";
import { 
  BadRequestException,
  NotFoundException 
} from "../../common";
import { successResponse } from "../../common/utils/response/success.response";

export class UserController {
  constructor(private userService: UserService) {}

  async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestException("User ID not found in request");
      }

      const user = await this.userService.getUserProfile(userId);
      
      successResponse(res, user, "User profile retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestException("User ID not found in request");
      }

      const validatedData = UpdateUserProfileSchema.parse(req.body);
      const updatedUser = await this.userService.updateUserProfile(userId, validatedData);

      successResponse(res, updatedUser, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestException("User ID not found in request");
      }

      const validatedData = ChangePasswordSchema.parse(req.body);
      await this.userService.changePassword(userId, validatedData);

      successResponse(res, null, "Password changed successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestException("User ID not found in request");
      }

      const validatedData = ProfilePictureSchema.parse(req.body);
      const updatedUser = await this.userService.updateProfilePicture(userId, validatedData);

      successResponse(res, updatedUser, "Profile picture updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async getMyPreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestException("User ID not found in request");
      }

      const preferences = await this.userService.getUserPreferences(userId);

      successResponse(res, preferences, "User preferences retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateMyPreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestException("User ID not found in request");
      }

      const validatedData = UserPreferencesSchema.parse(req.body);
      const preferences = await this.userService.updateUserPreferences(userId, validatedData);

      successResponse(res, preferences, "Preferences updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async getMyStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestException("User ID not found in request");
      }

      const stats = await this.userService.getUserStats(userId);

      successResponse(res, stats, "User stats retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async deactivateMyAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestException("User ID not found in request");
      }

      const validatedData = DeactivateAccountSchema.parse(req.body);
      await this.userService.deactivateAccount(userId, validatedData);

      successResponse(res, null, "Account deactivated successfully");
    } catch (error) {
      next(error);
    }
  }

  async getUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new BadRequestException("User ID is required");
      }

      const user = await this.userService.getUserProfile(userId);

      successResponse(res, user, "User profile retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getUserStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new BadRequestException("User ID is required");
      }

      const stats = await this.userService.getUserStats(userId);

      successResponse(res, stats, "User stats retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async searchUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedQuery = SearchUsersSchema.parse({
        searchTerm: req.query.searchTerm,
        role: req.query.role,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10
      });

      const result = await this.userService.searchUsers(validatedQuery);

      successResponse(res, result, "Users retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getUsersByRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role } = req.params;
      if (!role) {
        throw new BadRequestException("Role is required");
      }

      const users = await this.userService.getUsersByRole(role);

      successResponse(res, users, `${role} users retrieved successfully`);
    } catch (error) {
      next(error);
    }
  }

  async getAllActiveUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userService.getAllActiveUsers();

      successResponse(res, users, "Active users retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getUserWithRelations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new BadRequestException("User ID is required");
      }

      const user = await this.userService.getUserWithRelations(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      successResponse(res, user, "User with relations retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async reactivateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new BadRequestException("User ID is required");
      }

      await this.userService.reactivateAccount(userId);

      successResponse(res, null, "User account reactivated successfully");
    } catch (error) {
      next(error);
    }
  }
}

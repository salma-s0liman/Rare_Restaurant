import bcrypt from 'bcrypt';
import { UserRepository } from "./repositories";
import { User } from "../../DB/entity/user";
import { genderEnum } from "../../common/enums";
import { 
  NotFoundException, 
  UnauthorizedException,
  ApplicationException,
  ConflictException 
} from "../../common";
import {
  UpdateUserProfileType,
  ChangePasswordType,
  UserPreferencesType,
  ProfilePictureType,
  DeactivateAccountType,
  SearchUsersType
} from "./user.validation";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserProfile(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Remove sensitive information
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error: any) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw new ApplicationException(`Failed to get user profile: ${error.message}`);
    }
  }

  async updateUserProfile(userId: string, updateData: UpdateUserProfileType): Promise<User> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Check if phone number is already taken by another user
      if (updateData.phone && updateData.phone !== user.phone) {
        const existingUser = await this.userRepository.findByPhone(updateData.phone);
        if (existingUser && existingUser.id !== userId) {
          throw new ConflictException("Phone number already exists");
        }
      }

      // Convert gender string to enum if provided
      const updatePayload: any = { ...updateData };
      if (updateData.gender) {
        updatePayload.gender = updateData.gender as genderEnum;
      }

      const updatedUser = await this.userRepository.update(userId, updatePayload);
      if (!updatedUser) {
        throw new ApplicationException("Failed to update user profile");
      }

      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword as User;
    } catch (error: any) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw new ApplicationException(`Failed to update user profile: ${error.message}`);
    }
  }

  async changePassword(userId: string, passwordData: ChangePasswordType): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(passwordData.currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException("Current password is incorrect");
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(passwordData.newPassword, saltRounds);

      await this.userRepository.update(userId, {
        password: hashedNewPassword
      });
    } catch (error: any) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw new ApplicationException(`Failed to change password: ${error.message}`);
    }
  }

  async updateProfilePicture(userId: string, profileData: ProfilePictureType): Promise<User> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      const updatedUser = await this.userRepository.update(userId, {
        profilePicture: profileData.profilePicture || undefined
      });

      if (!updatedUser) {
        throw new ApplicationException("Failed to update profile picture");
      }

      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword as User;
    } catch (error: any) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw new ApplicationException(`Failed to update profile picture: ${error.message}`);
    }
  }

  async getUserPreferences(userId: string): Promise<any> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Return default preferences if not set
      return {
        language: user.language ?? 'en',
        currency: user.currency ?? 'USD'
      };
    } catch (error: any) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw new ApplicationException(`Failed to get user preferences: ${error.message}`);
    }
  }

  async updateUserPreferences(userId: string, preferences: UserPreferencesType): Promise<any> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      await this.userRepository.update(userId, preferences);

      return this.getUserPreferences(userId);
    } catch (error: any) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw new ApplicationException(`Failed to update user preferences: ${error.message}`);
    }
  }

  async getUserStats(userId: string): Promise<any> {
    try {
      const stats = await this.userRepository.getUserStats(userId);
      if (!stats) {
        throw new NotFoundException("User not found");
      }

      return stats;
    } catch (error: any) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw new ApplicationException(`Failed to get user stats: ${error.message}`);
    }
  }

  async deactivateAccount(userId: string, deactivationData: DeactivateAccountType): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Verify password before deactivation
      const isPasswordValid = await bcrypt.compare(deactivationData.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException("Incorrect password");
      }

      const success = await this.userRepository.deactivateUser(userId);
      if (!success) {
        throw new ApplicationException("Failed to deactivate account");
      }
    } catch (error: any) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw new ApplicationException(`Failed to deactivate account: ${error.message}`);
    }
  }

  async reactivateAccount(userId: string): Promise<void> {
    try {
      const success = await this.userRepository.reactivateUser(userId);
      if (!success) {
        throw new ApplicationException("Failed to reactivate account");
      }
    } catch (error: any) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw new ApplicationException(`Failed to reactivate account: ${error.message}`);
    }
  }

  async searchUsers(searchData: SearchUsersType): Promise<any> {
    try {
      const { searchTerm, role, page, limit } = searchData;
      const users = await this.userRepository.searchUsers(searchTerm, role);

      // Remove passwords and paginate
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      });

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = usersWithoutPasswords.slice(startIndex, endIndex);

      return {
        users: paginatedUsers,
        total: users.length,
        page,
        limit,
        totalPages: Math.ceil(users.length / limit)
      };
    } catch (error: any) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw new ApplicationException(`Failed to search users: ${error.message}`);
    }
  }

  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const users = await this.userRepository.findActiveUsers(role);
      
      return users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      });
    } catch (error: any) {
      throw new ApplicationException(`Failed to get users by role: ${error.message}`);
    }
  }

  async getAllActiveUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.findActiveUsers();
      
      return users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      });
    } catch (error: any) {
      throw new ApplicationException(`Failed to get active users: ${error.message}`);
    }
  }

  async getUserWithRelations(userId: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByIdWithRelations(userId);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      }
      return user;
    } catch (error: any) {
      throw new ApplicationException(`Failed to get user with relations: ${error.message}`);
    }
  }
}
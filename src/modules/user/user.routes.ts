import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../common";
import { userRoleEnum } from "../../common/enums";

export const userRoutes = (userController: UserController) => {
  const router = Router();

  // Self-service routes (authenticated user managing own account)
  /**
   * @swagger
   * /users/profile:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get user profile
   *     description: Get current user's profile information
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/User'
   *             example:
   *               success: true
   *               message: "Profile retrieved successfully"
   *               data:
   *                 id: "123e4567-e89b-12d3-a456-426614174000"
   *                 email: "john.doe@example.com"
   *                 firstName: "John"
   *                 lastName: "Doe"
   *                 phone: "+1234567890"
   *                 profilePicture: "https://example.com/profile.jpg"
   *                 role: "customer"
   *                 isActive: true
   *                 createdAt: "2024-01-15T10:30:00.000Z"
   *       '401':
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get(
    "/profile", 
    auth(), 
    userController.getMyProfile.bind(userController)
  );

  /**
   * @swagger
   * /users/profile:
   *   put:
   *     tags:
   *       - Users
   *     summary: Update user profile
   *     description: Update current user's profile information
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserProfile'
   *           examples:
   *             basic_update:
   *               summary: Basic profile update
   *               value:
   *                 firstName: "John"
   *                 lastName: "Doe"
   *                 phone: "+1234567890"
   *             with_picture:
   *               summary: Update with profile picture
   *               value:
   *                 firstName: "John"
   *                 lastName: "Updated Doe"
   *                 phone: "+1234567891"
   *                 profilePicture: "https://example.com/new-profile.jpg"
   *     responses:
   *       '200':
   *         description: Profile updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/User'
   *       '400':
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       '401':
   *         description: Unauthorized
   */
  router.put(
    "/profile", 
    auth(), 
    userController.updateMyProfile.bind(userController)
  );

  /**
   * @swagger
   * /users/change-password:
   *   put:
   *     tags:
   *       - Users
   *     summary: Change password
   *     description: Change current user's password
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ChangePassword'
   *           example:
   *             currentPassword: "CurrentPassword123"
   *             newPassword: "NewSecurePassword456"
   *     responses:
   *       '200':
   *         description: Password changed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *             example:
   *               success: true
   *               message: "Password changed successfully"
   *               data: {}
   *       '400':
   *         description: Validation error or incorrect current password
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             examples:
   *               validation_error:
   *                 summary: Validation errors
   *                 value:
   *                   success: false
   *                   message: "Validation failed"
   *                   errors: [
   *                     "Current password is required",
   *                     "New password must be at least 6 characters"
   *                   ]
   *               wrong_password:
   *                 summary: Incorrect current password
   *                 value:
   *                   success: false
   *                   message: "Current password is incorrect"
   *       '401':
   *         description: Unauthorized
   */
  router.put(
    "/change-password", 
    auth(), 
    userController.changePassword.bind(userController)
  );

  /**
   * @swagger
   * /users/profile-picture:
   *   put:
   *     tags:
   *       - Users
   *     summary: Update profile picture
   *     description: Update current user's profile picture
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - profilePicture
   *             properties:
   *               profilePicture:
   *                 type: string
   *                 format: uri
   *                 example: "https://example.com/profile-pictures/user123.jpg"
   *                 description: URL of the new profile picture
   *           example:
   *             profilePicture: "https://example.com/profile-pictures/user123.jpg"
   *     responses:
   *       '200':
   *         description: Profile picture updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         profilePicture:
   *                           type: string
   *                           example: "https://example.com/profile-pictures/user123.jpg"
   *       '400':
   *         description: Validation error
   *       '401':
   *         description: Unauthorized
   */
  router.put(
    "/profile-picture", 
    auth(), 
    userController.updateProfilePicture.bind(userController)
  );

  /**
   * @swagger
   * /users/preferences:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get user preferences
   *     description: Get current user's preferences and settings
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Preferences retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         language:
   *                           type: string
   *                           example: "en"
   *                         timezone:
   *                           type: string
   *                           example: "America/New_York"
   *                         currency:
   *                           type: string
   *                           example: "USD"
   *                         dietaryRestrictions:
   *                           type: array
   *                           items:
   *                             type: string
   *                           example: ["vegetarian", "no-nuts"]
   *       '401':
   *         description: Unauthorized
   */
  router.get(
    "/preferences", 
    auth(), 
    userController.getMyPreferences.bind(userController)
  );

  /**
   * @swagger
   * /users/preferences:
   *   put:
   *     tags:
   *       - Users
   *     summary: Update user preferences
   *     description: Update current user's preferences and settings
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               language:
   *                 type: string
   *                 enum: ["en", "es", "fr", "de"]
   *                 example: "en"
   *               timezone:
   *                 type: string
   *                 example: "America/New_York"
   *               currency:
   *                 type: string
   *                 enum: ["USD", "EUR", "GBP"]
   *                 example: "USD"
   *               dietaryRestrictions:
   *                 type: array
   *                 items:
   *                   type: string
   *                   enum: ["vegetarian", "vegan", "gluten-free", "dairy-free", "no-nuts", "halal", "kosher"]
   *                 example: ["vegetarian", "gluten-free"]
   *           example:
   *             language: "en"
   *             timezone: "America/New_York"
   *             currency: "USD"
   *             dietaryRestrictions: ["vegetarian", "no-nuts"]
   *     responses:
   *       '200':
   *         description: Preferences updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       '400':
   *         description: Validation error
   *       '401':
   *         description: Unauthorized
   */
  router.put(
    "/preferences", 
    auth(), 
    userController.updateMyPreferences.bind(userController)
  );

  /**
   * @swagger
   * /users/stats:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get user statistics
   *     description: Get current user's activity statistics
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: User statistics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         totalOrders:
   *                           type: integer
   *                           example: 25
   *                         totalSpent:
   *                           type: number
   *                           format: float
   *                           example: 456.78
   *                         averageOrderValue:
   *                           type: number
   *                           format: float
   *                           example: 18.27
   *                         favoriteRestaurants:
   *                           type: array
   *                           items:
   *                             type: object
   *                             properties:
   *                               id:
   *                                 type: string
   *                                 format: uuid
   *                               name:
   *                                 type: string
   *                               orderCount:
   *                                 type: integer
   *                           example:
   *                             - id: "123e4567-e89b-12d3-a456-426614174001"
   *                               name: "Mario's Pizza Palace"
   *                               orderCount: 8
   *                         recentOrders:
   *                           type: integer
   *                           example: 3
   *                           description: "Orders in the last 30 days"
   *             example:
   *               success: true
   *               message: "User statistics retrieved successfully"
   *               data:
   *                 totalOrders: 25
   *                 totalSpent: 456.78
   *                 averageOrderValue: 18.27
   *                 favoriteRestaurants:
   *                   - id: "123e4567-e89b-12d3-a456-426614174001"
   *                     name: "Mario's Pizza Palace"
   *                     orderCount: 8
   *                   - id: "123e4567-e89b-12d3-a456-426614174002"
   *                     name: "Burger Junction"
   *                     orderCount: 5
   *                 recentOrders: 3
   *       '401':
   *         description: Unauthorized
   */
  router.get(
    "/stats", 
    auth(), 
    userController.getMyStats.bind(userController)
  );

  /**
   * @swagger
   * /users/deactivate:
   *   delete:
   *     tags:
   *       - Users
   *     summary: Deactivate own account
   *     description: Deactivate current user's account (soft delete)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Account deactivated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *             example:
   *               success: true
   *               message: "Account deactivated successfully"
   *               data: {}
   *       '401':
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         description: Internal server error
   */
  router.delete(
    "/deactivate", 
    auth(), 
    userController.deactivateMyAccount.bind(userController)
  );

  // Admin/Manager routes for user management
  /**
   * @swagger
   * /users/search:
   *   get:
   *     tags:
   *       - Users
   *       - Admin
   *     summary: Search users (Admin only)
   *     description: Search for users by various criteria. Requires admin, owner, or manager role.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search term for email, name, or phone
   *         example: "john"
   *       - in: query
   *         name: role
   *         schema:
   *           type: string
   *           enum: [customer, restaurant_admin, admin, owner, manager]
   *         description: Filter by user role
   *         example: "customer"
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [active, inactive]
   *         description: Filter by user status
   *         example: "active"
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Number of users per page
   *     responses:
   *       '200':
   *         description: Users retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         users:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/User'
   *                         pagination:
   *                           $ref: '#/components/schemas/Pagination'
   *             example:
   *               success: true
   *               message: "Users retrieved successfully"
   *               data:
   *                 users:
   *                   - id: "123e4567-e89b-12d3-a456-426614174000"
   *                     email: "john.doe@example.com"
   *                     firstName: "John"
   *                     lastName: "Doe"
   *                     role: "customer"
   *                     isActive: true
   *                     createdAt: "2024-01-15T10:30:00.000Z"
   *                 pagination:
   *                   page: 1
   *                   limit: 10
   *                   total: 25
   *                   totalPages: 3
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get(
    "/search",
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    userController.searchUsers.bind(userController)
  );

  /**
   * @swagger
   * /users/role/{role}:
   *   get:
   *     tags:
   *       - Users
   *       - Admin
   *     summary: Get users by role (Admin only)
   *     description: Retrieve all users with a specific role. Requires admin, owner, or manager role.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: role
   *         required: true
   *         schema:
   *           type: string
   *           enum: [customer, restaurant_admin, admin, owner, manager]
   *         description: The role to filter users by
   *         example: "customer"
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *     responses:
   *       '200':
   *         description: Users retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         users:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/User'
   *                         role:
   *                           type: string
   *                           example: "customer"
   *                         pagination:
   *                           $ref: '#/components/schemas/Pagination'
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Insufficient permissions
   */
  router.get(
    "/role/:role",
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    userController.getUsersByRole.bind(userController)
  );

  /**
   * @swagger
   * /users/active:
   *   get:
   *     tags:
   *       - Users
   *       - Admin
   *     summary: Get all active users (Admin only)
   *     description: Retrieve all active users in the system. Requires admin, owner, or manager role.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [createdAt, firstName, lastName, email]
   *           default: createdAt
   *         description: Field to sort by
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: desc
   *         description: Sort order
   *     responses:
   *       '200':
   *         description: Active users retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         users:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/User'
   *                         pagination:
   *                           $ref: '#/components/schemas/Pagination'
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Insufficient permissions
   */
  router.get(
    "/active",
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    userController.getAllActiveUsers.bind(userController)
  );

  /**
   * @swagger
   * /users/{userId}/profile:
   *   get:
   *     tags:
   *       - Users
   *       - Admin
   *     summary: Get user profile by ID (Admin only)
   *     description: Get specific user's profile information. Requires admin, owner, or manager role.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: User ID to get profile for
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       '200':
   *         description: User profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/User'
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Insufficient permissions
   *       '404':
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get(
    "/:userId/profile",
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    userController.getUserProfile.bind(userController)
  );

  /**
   * @swagger
   * /users/{userId}/stats:
   *   get:
   *     tags:
   *       - Users
   *       - Admin
   *     summary: Get user statistics by ID (Admin only)
   *     description: Get specific user's activity statistics. Requires admin, owner, or manager role.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: User ID to get statistics for
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       '200':
   *         description: User statistics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         userId:
   *                           type: string
   *                           format: uuid
   *                         totalOrders:
   *                           type: integer
   *                         totalSpent:
   *                           type: number
   *                           format: float
   *                         averageOrderValue:
   *                           type: number
   *                           format: float
   *                         favoriteRestaurants:
   *                           type: array
   *                           items:
   *                             type: object
   *                         recentOrders:
   *                           type: integer
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Insufficient permissions
   *       '404':
   *         description: User not found
   */
  router.get(
    "/:userId/stats",
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    userController.getUserStats.bind(userController)
  );

  /**
   * @swagger
   * /users/{userId}/details:
   *   get:
   *     tags:
   *       - Users
   *       - Admin
   *     summary: Get user with relations (Admin only)
   *     description: Get complete user information including related data (addresses, orders, etc.). Requires admin, owner, or manager role.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: User ID to get detailed information for
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *       - in: query
   *         name: includeOrders
   *         schema:
   *           type: boolean
   *           default: false
   *         description: Include user's order history
   *       - in: query
   *         name: includeAddresses
   *         schema:
   *           type: boolean
   *           default: true
   *         description: Include user's saved addresses
   *       - in: query
   *         name: includeCart
   *         schema:
   *           type: boolean
   *           default: false
   *         description: Include user's current cart
   *     responses:
   *       '200':
   *         description: User details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         user:
   *                           $ref: '#/components/schemas/User'
   *                         addresses:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/Address'
   *                         orders:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/Order'
   *                         cart:
   *                           $ref: '#/components/schemas/Cart'
   *             example:
   *               success: true
   *               message: "User details retrieved successfully"
   *               data:
   *                 user:
   *                   id: "123e4567-e89b-12d3-a456-426614174000"
   *                   email: "john.doe@example.com"
   *                   firstName: "John"
   *                   lastName: "Doe"
   *                   role: "customer"
   *                   isActive: true
   *                 addresses:
   *                   - id: "addr-123"
   *                     street: "123 Main St"
   *                     city: "New York"
   *                     zipCode: "10001"
   *                 orders: []
   *                 cart:
   *                   id: "cart-123"
   *                   items: []
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Insufficient permissions
   *       '404':
   *         description: User not found
   */
  router.get(
    "/:userId/details",
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    userController.getUserWithRelations.bind(userController)
  );

  /**
   * @swagger
   * /users/{userId}/reactivate:
   *   put:
   *     tags:
   *       - Users
   *       - Admin
   *     summary: Reactivate user account (Admin only)
   *     description: Reactivate a deactivated user account. Requires admin or owner role.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: User ID to reactivate
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       '200':
   *         description: User reactivated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/User'
   *             example:
   *               success: true
   *               message: "User reactivated successfully"
   *               data:
   *                 id: "123e4567-e89b-12d3-a456-426614174000"
   *                 email: "john.doe@example.com"
   *                 firstName: "John"
   *                 lastName: "Doe"
   *                 isActive: true
   *                 reactivatedAt: "2024-01-15T14:30:00.000Z"
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Insufficient permissions (requires admin or owner role)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       '404':
   *         description: User not found
   *       '400':
   *         description: User is already active
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               success: false
   *               message: "User is already active"
   */
  router.put(
    "/:userId/reactivate",
    auth([userRoleEnum.admin, userRoleEnum.owner]),
    userController.reactivateUser.bind(userController)
  );

  return router;
};
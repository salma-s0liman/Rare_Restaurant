import { Router } from "express";
import * as validators from "./auth.validation";
import authService from "./auth.service";
import { auth, validation } from "../../common/";
const router: Router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Create a new user account with email, password, and basic information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignup'
 *           examples:
 *             customer:
 *               summary: Customer registration
 *               value:
 *                 email: "customer@example.com"
 *                 password: "SecurePassword123"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 phone: "+1234567890"
 *                 role: "customer"
 *             admin:
 *               summary: Admin registration
 *               value:
 *                 email: "admin@example.com"
 *                 password: "AdminPassword123"
 *                 firstName: "Admin"
 *                 lastName: "User"
 *                 phone: "+1234567891"
 *                 role: "admin"
 *             restaurant_owner:
 *               summary: Restaurant owner registration
 *               value:
 *                 email: "owner@pizzapalace.com"
 *                 password: "OwnerPassword123"
 *                 firstName: "Mario"
 *                 lastName: "Rossi"
 *                 phone: "+1234567892"
 *                 role: "owner"
 *     responses:
 *       '201':
 *         description: User registered successfully
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
 *                         token:
 *                           type: string
 *                           description: JWT authentication token
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             example:
 *               success: true
 *               message: "User registered successfully"
 *               data:
 *                 user:
 *                   id: "123e4567-e89b-12d3-a456-426614174000"
 *                   email: "customer@example.com"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   phone: "+1234567890"
 *                   role: "customer"
 *                   isActive: true
 *                   createdAt: "2024-01-15T10:30:00.000Z"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       '400':
 *         description: Validation error or user already exists
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
 *                     "Email is required",
 *                     "Password must be at least 6 characters",
 *                     "Phone number is invalid"
 *                   ]
 *               duplicate_email:
 *                 summary: Email already exists
 *                 value:
 *                   success: false
 *                   message: "User with this email already exists"
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/signup",
  validation(validators.signupValidation),
  authService.signup
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticate user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *           examples:
 *             customer_login:
 *               summary: Customer login
 *               value:
 *                 email: "customer@example.com"
 *                 password: "SecurePassword123"
 *             admin_login:
 *               summary: Admin login
 *               value:
 *                 email: "admin@example.com"
 *                 password: "AdminPassword123"
 *             owner_login:
 *               summary: Restaurant owner login
 *               value:
 *                 email: "owner@pizzapalace.com"
 *                 password: "OwnerPassword123"
 *     responses:
 *       '200':
 *         description: Login successful
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
 *                         token:
 *                           type: string
 *                           description: JWT authentication token
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             example:
 *               success: true
 *               message: "Login successful"
 *               data:
 *                 user:
 *                   id: "123e4567-e89b-12d3-a456-426614174000"
 *                   email: "customer@example.com"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   role: "customer"
 *                   isActive: true
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       '401':
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_credentials:
 *                 summary: Wrong email or password
 *                 value:
 *                   success: false
 *                   message: "Invalid email or password"
 *               account_inactive:
 *                 summary: Account deactivated
 *                 value:
 *                   success: false
 *                   message: "Account is inactive. Please contact support."
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Validation failed"
 *               errors: [
 *                 "Email is required",
 *                 "Password is required"
 *               ]
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/login",
  validation(validators.loginValidation),
  authService.login
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User logout
 *     description: Logout user and invalidate JWT token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token to invalidate
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *           example:
 *             token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       '200':
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Logout successful"
 *               data: {}
 *       '401':
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_token:
 *                 summary: No token provided
 *                 value:
 *                   success: false
 *                   message: "Access denied. No token provided."
 *               invalid_token:
 *                 summary: Invalid token
 *                 value:
 *                   success: false
 *                   message: "Invalid token."
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/logout",
  validation(validators.logoutValidation),
  auth(), // Requires authentication
  authService.logout
);

export default router;

import { Router } from "express";
import { AddressController } from "./address.controller";
import { auth, validation } from "../../common";
import * as validators from "./address.validation";

export const addressRoutes = (addressController: AddressController) => {
  const router = Router();

  // Create address
  /**
   * @swagger
   * /addresses:
   *   post:
   *     tags:
   *       - Addresses
   *     summary: Create new address
   *     description: Create a new address for the authenticated user
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AddressInput'
   *           examples:
   *             home_address:
   *               summary: Home address
   *               value:
   *                 name: "Home"
   *                 street: "123 Main Street"
   *                 city: "New York"
   *                 state: "NY"
   *                 zipCode: "10001"
   *                 country: "USA"
   *                 phone: "+1234567890"
   *                 isDefault: true
   *             work_address:
   *               summary: Work address
   *               value:
   *                 name: "Work"
   *                 street: "456 Business Ave"
   *                 city: "Manhattan"
   *                 state: "NY"
   *                 zipCode: "10005"
   *                 country: "USA"
   *                 phone: "+1234567890"
   *                 isDefault: false
   *     responses:
   *       '201':
   *         description: Address created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Address'
   *             example:
   *               success: true
   *               message: "Address created successfully"
   *               data:
   *                 id: "123e4567-e89b-12d3-a456-426614174000"
   *                 name: "Home"
   *                 street: "123 Main Street"
   *                 city: "New York"
   *                 state: "NY"
   *                 zipCode: "10001"
   *                 country: "USA"
   *                 phone: "+1234567890"
   *                 isDefault: true
   *                 createdAt: "2024-01-15T10:30:00.000Z"
   *       '400':
   *         description: Validation error
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
   *                     "Street address is required",
   *                     "City is required",
   *                     "ZIP code must be valid"
   *                   ]
   *       '401':
   *         description: Unauthorized
   */
  router.post(
    "/",
    auth([]),
    validation(validators.createAddressValidation),
    addressController.createAddress
  );

  // Get all user addresses
  /**
   * @swagger
   * /addresses:
   *   get:
   *     tags:
   *       - Addresses
   *     summary: Get user addresses
   *     description: Get all addresses for the authenticated user
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Addresses retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Address'
   *             example:
   *               success: true
   *               message: "Addresses retrieved successfully"
   *               data:
   *                 - id: "123e4567-e89b-12d3-a456-426614174000"
   *                   name: "Home"
   *                   street: "123 Main Street"
   *                   city: "New York"
   *                   state: "NY"
   *                   zipCode: "10001"
   *                   country: "USA"
   *                   phone: "+1234567890"
   *                   isDefault: true
   *                   createdAt: "2024-01-15T10:30:00.000Z"
   *                 - id: "123e4567-e89b-12d3-a456-426614174001"
   *                   name: "Work"
   *                   street: "456 Business Ave"
   *                   city: "Manhattan"
   *                   state: "NY"
   *                   zipCode: "10005"
   *                   country: "USA"
   *                   phone: "+1234567890"
   *                   isDefault: false
   *                   createdAt: "2024-01-14T09:15:00.000Z"
   *       '401':
   *         description: Unauthorized
   */
  router.get("/", auth([]), addressController.getUserAddresses);

  // Get address by ID
  /**
   * @swagger
   * /addresses/{id}:
   *   get:
   *     tags:
   *       - Addresses
   *     summary: Get address by ID
   *     description: Get specific address by ID for the authenticated user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Address ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       '200':
   *         description: Address retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Address'
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Address not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               success: false
   *               message: "Address not found"
   */
  router.get(
    "/:id",
    auth([]),
    validation(validators.addressIdValidation),
    addressController.getAddressById
  );

  // Update address
  /**
   * @swagger
   * /addresses/{id}:
   *   put:
   *     tags:
   *       - Addresses
   *     summary: Update address
   *     description: Update an existing address for the authenticated user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Address ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AddressInput'
   *           examples:
   *             update_address:
   *               summary: Update address
   *               value:
   *                 name: "Updated Home"
   *                 street: "789 Updated Street"
   *                 city: "New York"
   *                 state: "NY"
   *                 zipCode: "10002"
   *                 country: "USA"
   *                 phone: "+1234567891"
   *                 isDefault: true
   *     responses:
   *       '200':
   *         description: Address updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Address'
   *       '400':
   *         description: Validation error
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Address not found
   */
  router.put(
    "/:id",
    auth([]),
    validation(validators.updateAddressValidation),
    addressController.updateAddress
  );

  // Delete address
  /**
   * @swagger
   * /addresses/{id}:
   *   delete:
   *     tags:
   *       - Addresses
   *     summary: Delete address
   *     description: Delete an address for the authenticated user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Address ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       '200':
   *         description: Address deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *             example:
   *               success: true
   *               message: "Address deleted successfully"
   *               data: {}
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Address not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       '400':
   *         description: Cannot delete default address
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               success: false
   *               message: "Cannot delete the default address. Please set another address as default first."
   */
  router.delete(
    "/:id",
    auth([]),
    validation(validators.addressIdValidation),
    addressController.deleteAddress
  );

  // Set primary address
  /**
   * @swagger
   * /addresses/{id}/primary:
   *   patch:
   *     tags:
   *       - Addresses
   *     summary: Set primary address
   *     description: Set an address as the primary/default address for the authenticated user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Address ID to set as primary
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       '200':
   *         description: Primary address updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Address'
   *             example:
   *               success: true
   *               message: "Primary address updated successfully"
   *               data:
   *                 id: "123e4567-e89b-12d3-a456-426614174000"
   *                 name: "Home"
   *                 street: "123 Main Street"
   *                 city: "New York"
   *                 state: "NY"
   *                 zipCode: "10001"
   *                 country: "USA"
   *                 phone: "+1234567890"
   *                 isDefault: true
   *                 updatedAt: "2024-01-15T14:30:00.000Z"
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Address not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.patch(
    "/:id/primary",
    auth([]),
    validation(validators.addressIdValidation),
    addressController.setPrimaryAddress
  );

  return router;
};

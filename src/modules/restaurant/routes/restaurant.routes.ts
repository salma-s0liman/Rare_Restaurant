import { Router } from "express";
import { validation } from "../../../common/middleware/validation.middleware";
import { RestaurantController } from "../controllers/restaurant.controller";
import { CategoryController } from "../controllers/category.controller";
import { MenuItemController } from "../controllers/menuItem.controller";
import { auth, userRoleEnum } from "../../../common";
import * as validators from "../validation";

export const restaurantRoutes = (
  restaurantController: RestaurantController,
  categoryController: CategoryController,
  menuItemController: MenuItemController
) => {
  const router = Router();

  // RESTAURANTS
  /**
   * @swagger
   * /restaurants:
   *   post:
   *     tags:
   *       - Restaurants
   *     summary: Create a new restaurant
   *     description: Create a new restaurant (requires authentication)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RestaurantCreate'
   *           examples:
   *             pizza_restaurant:
   *               summary: Pizza restaurant
   *               value:
   *                 name: "Mario's Pizza Palace"
   *                 description: "Authentic Italian pizza with fresh ingredients and traditional recipes passed down through generations"
   *                 address: "123 Main Street, Downtown, New York, NY 10001"
   *                 phone: "+1-555-0123"
   *                 email: "contact@mariospizza.com"
   *                 image: "https://example.com/restaurants/marios-pizza.jpg"
   *                 openingHours: "Monday-Sunday: 11:00 AM - 11:00 PM"
   *                 deliveryFee: 3.99
   *                 minimumOrder: 15.00
   *             burger_restaurant:
   *               summary: Burger restaurant
   *               value:
   *                 name: "Burger Junction"
   *                 description: "Gourmet burgers made with premium beef and fresh local ingredients"
   *                 address: "456 Oak Avenue, Midtown, New York, NY 10002"
   *                 phone: "+1-555-0124"
   *                 email: "info@burgerjunction.com"
   *                 image: "https://example.com/restaurants/burger-junction.jpg"
   *                 openingHours: "Monday-Thursday: 11:00 AM - 10:00 PM, Friday-Sunday: 11:00 AM - 11:00 PM"
   *                 deliveryFee: 2.49
   *                 minimumOrder: 12.00
   *     responses:
   *       '201':
   *         description: Restaurant created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Restaurant'
   *       '400':
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       '401':
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post(
    "/",
   // auth([]),
    validation(validators.createRestaurantValidation),
    restaurantController.createRestaurant
  );

  /**
   * @swagger
   * /restaurants:
   *   get:
   *     tags:
   *       - Restaurants
   *     summary: Get all restaurants
   *     description: Retrieve a list of all restaurants with pagination and filtering options
   *     parameters:
   *       - name: page
   *         in: query
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *           example: 1
   *         description: Page number for pagination
   *       - name: limit
   *         in: query
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *           example: 10
   *         description: Number of restaurants per page
   *       - name: search
   *         in: query
   *         required: false
   *         schema:
   *           type: string
   *           example: "pizza"
   *         description: Search term for restaurant name or cuisine
   *       - name: city
   *         in: query
   *         required: false
   *         schema:
   *           type: string
   *           example: "New York"
   *         description: Filter by city
   *       - name: sortBy
   *         in: query
   *         required: false
   *         schema:
   *           type: string
   *           enum: [name, rating, deliveryFee, createdAt]
   *           default: name
   *           example: rating
   *         description: Sort criteria
   *       - name: sortOrder
   *         in: query
   *         required: false
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: asc
   *           example: desc
   *         description: Sort order
   *     responses:
   *       '200':
   *         description: Restaurants retrieved successfully
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
   *                         restaurants:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/Restaurant'
   *                         pagination:
   *                           $ref: '#/components/schemas/PaginationMeta'
   *             example:
   *               success: true
   *               message: "Restaurants retrieved successfully"
   *               data:
   *                 restaurants:
   *                   - id: "123e4567-e89b-12d3-a456-426614174001"
   *                     name: "Mario's Pizza Palace"
   *                     description: "Authentic Italian pizza"
   *                     address: "123 Main Street, New York"
   *                     rating: 4.5
   *                     deliveryFee: 3.99
   *                     minimumOrder: 15.00
   *                     isActive: true
   *                   - id: "123e4567-e89b-12d3-a456-426614174002"
   *                     name: "Burger Junction"
   *                     description: "Gourmet burgers"
   *                     address: "456 Oak Avenue, New York"
   *                     rating: 4.2
   *                     deliveryFee: 2.49
   *                     minimumOrder: 12.00
   *                     isActive: true
   *                 pagination:
   *                   page: 1
   *                   limit: 10
   *                   total: 25
   *                   totalPages: 3
   */
  router.get("/", restaurantController.getAllRestaurants);

  /**
   * @swagger
   * /restaurants/{id}:
   *   get:
   *     tags:
   *       - Restaurants
   *     summary: Get restaurant by ID
   *     description: Retrieve detailed information about a specific restaurant
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174001"
   *         description: Restaurant unique identifier
   *     responses:
   *       '200':
   *         description: Restaurant details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Restaurant'
   *             example:
   *               success: true
   *               message: "Restaurant details retrieved successfully"
   *               data:
   *                 id: "123e4567-e89b-12d3-a456-426614174001"
   *                 name: "Mario's Pizza Palace"
   *                 description: "Authentic Italian pizza with fresh ingredients"
   *                 address: "123 Main Street, Downtown, New York, NY 10001"
   *                 phone: "+1-555-0123"
   *                 email: "contact@mariospizza.com"
   *                 image: "https://example.com/restaurants/marios-pizza.jpg"
   *                 openingHours: "Monday-Sunday: 11:00 AM - 11:00 PM"
   *                 deliveryFee: 3.99
   *                 minimumOrder: 15.00
   *                 isActive: true
   *                 rating: 4.5
   *                 createdAt: "2024-01-15T10:30:00.000Z"
   *                 updatedAt: "2024-01-15T10:30:00.000Z"
   *       '404':
   *         description: Restaurant not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               success: false
   *               message: "Restaurant not found"
   */
  router.get("/:id", restaurantController.getRestaurantById);
  /**
   * @swagger
   * /restaurants/{id}:
   *   put:
   *     tags:
   *       - Restaurants
   *     summary: Update restaurant
   *     description: Update restaurant information (owner only)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174001"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Mario's Updated Pizza Palace"
   *               description:
   *                 type: string
   *                 example: "Updated authentic Italian pizza with new recipes"
   *               address:
   *                 type: string
   *                 example: "123 Main Street, Downtown, New York, NY 10001"
   *               phone:
   *                 type: string
   *                 example: "+1-555-0123"
   *               email:
   *                 type: string
   *                 example: "contact@mariospizza.com"
   *               openingHours:
   *                 type: string
   *                 example: "Monday-Sunday: 10:00 AM - 12:00 AM"
   *               deliveryFee:
   *                 type: number
   *                 example: 4.99
   *               minimumOrder:
   *                 type: number
   *                 example: 20.00
   *               isActive:
   *                 type: boolean
   *                 example: true
   *           example:
   *             name: "Mario's Updated Pizza Palace"
   *             openingHours: "Monday-Sunday: 10:00 AM - 12:00 AM"
   *             deliveryFee: 4.99
   *             minimumOrder: 20.00
   *     responses:
   *       '200':
   *         description: Restaurant updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Restaurant'
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Forbidden - Not the restaurant owner
   *       '404':
   *         description: Restaurant not found
   */
  router.put(
    "/:id",
    auth([userRoleEnum.owner]),
    validation(validators.updateRestaurantValidation),
    restaurantController.updateRestaurant
  );

  /**
   * @swagger
   * /restaurants/{id}:
   *   delete:
   *     tags:
   *       - Restaurants
   *     summary: Delete restaurant
   *     description: Delete a restaurant (owner only)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174001"
   *     responses:
   *       '200':
   *         description: Restaurant deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *             example:
   *               success: true
   *               message: "Restaurant deleted successfully"
   *               data: {}
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Forbidden - Not the restaurant owner
   *       '404':
   *         description: Restaurant not found
   */
  router.delete(
    "/:id",
    auth([userRoleEnum.owner]),
    restaurantController.deleteRestaurant
  );

  // CATEGORIES
  /**
   * @swagger
   * /restaurants/{restaurantId}/categories:
   *   post:
   *     tags:
   *       - Categories
   *     summary: Create category
   *     description: Add a new category to a restaurant
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: restaurantId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174001"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CategoryCreate'
   *           examples:
   *             pizza_category:
   *               summary: Pizza category
   *               value:
   *                 name: "Pizzas"
   *                 description: "Hand-tossed pizzas with fresh toppings"
   *                 image: "https://example.com/categories/pizza.jpg"
   *                 isActive: true
   *                 sortOrder: 1
   *             appetizer_category:
   *               summary: Appetizer category
   *               value:
   *                 name: "Appetizers"
   *                 description: "Delicious starters to begin your meal"
   *                 image: "https://example.com/categories/appetizers.jpg"
   *                 isActive: true
   *                 sortOrder: 0
   *     responses:
   *       '201':
   *         description: Category created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Category'
   *       '400':
   *         description: Validation error
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Restaurant not found
   */
  router.post(
    "/:restaurantId/categories",
    auth([]),
    validation(validators.createCategoryValidation),
    categoryController.createCategory
  );

  /**
   * @swagger
   * /restaurants/{restaurantId}/categories:
   *   get:
   *     tags:
   *       - Categories
   *     summary: Get restaurant categories
   *     description: Get all categories for a specific restaurant
   *     parameters:
   *       - name: restaurantId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174001"
   *       - name: includeInactive
   *         in: query
   *         required: false
   *         schema:
   *           type: boolean
   *           default: false
   *           example: false
   *         description: Include inactive categories
   *     responses:
   *       '200':
   *         description: Categories retrieved successfully
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
   *                         $ref: '#/components/schemas/Category'
   *             example:
   *               success: true
   *               message: "Categories retrieved successfully"
   *               data:
   *                 - id: "123e4567-e89b-12d3-a456-426614174002"
   *                   name: "Appetizers"
   *                   description: "Delicious starters"
   *                   isActive: true
   *                   sortOrder: 0
   *                 - id: "123e4567-e89b-12d3-a456-426614174003"
   *                   name: "Pizzas"
   *                   description: "Hand-tossed pizzas"
   *                   isActive: true
   *                   sortOrder: 1
   *       '404':
   *         description: Restaurant not found
   */
  router.get("/:restaurantId/categories", categoryController.getCategories);

  /**
   * @swagger
   * /restaurants/categories/{id}:
   *   put:
   *     tags:
   *       - Categories
   *     summary: Update category
   *     description: Update an existing category
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174002"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Updated Pizzas"
   *               description:
   *                 type: string
   *                 example: "Updated description for hand-tossed pizzas"
   *               image:
   *                 type: string
   *                 example: "https://example.com/categories/updated-pizza.jpg"
   *               isActive:
   *                 type: boolean
   *                 example: true
   *               sortOrder:
   *                 type: integer
   *                 example: 1
   *     responses:
   *       '200':
   *         description: Category updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Category'
   *       '400':
   *         description: Validation error
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Category not found
   */
  router.put(
    "/categories/:id",
    auth([]),
    validation(validators.updateCategoryValidation),
    categoryController.updateCategory
  );

  /**
   * @swagger
   * /restaurants/categories/{id}:
   *   delete:
   *     tags:
   *       - Categories
   *     summary: Delete category
   *     description: Delete a category (will also remove associated menu items)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174002"
   *     responses:
   *       '200':
   *         description: Category deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Category not found
   */
  router.delete("/categories/:id", auth([]), categoryController.deleteCategory);

  // MENU ITEMS
  /**
   * @swagger
   * /restaurants/{restaurantId}/menu-items:
   *   post:
   *     tags:
   *       - Menu Items
   *     summary: Create menu item
   *     description: Add a new menu item to a restaurant category
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: restaurantId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174001"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MenuItemCreate'
   *           examples:
   *             margherita_pizza:
   *               summary: Margherita Pizza
   *               value:
   *                 name: "Margherita Pizza"
   *                 description: "Classic pizza with fresh tomato sauce, mozzarella, and basil"
   *                 price: 14.99
   *                 categoryId: "123e4567-e89b-12d3-a456-426614174002"
   *                 image: "https://example.com/menu/margherita-pizza.jpg"
   *                 isAvailable: true
   *                 preparationTime: 15
   *                 ingredients: ["Tomato sauce", "Mozzarella cheese", "Fresh basil", "Olive oil"]
   *                 allergens: ["Gluten", "Dairy"]
   *             caesar_salad:
   *               summary: Caesar Salad
   *               value:
   *                 name: "Caesar Salad"
   *                 description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan"
   *                 price: 8.99
   *                 categoryId: "123e4567-e89b-12d3-a456-426614174004"
   *                 image: "https://example.com/menu/caesar-salad.jpg"
   *                 isAvailable: true
   *                 preparationTime: 5
   *                 ingredients: ["Romaine lettuce", "Caesar dressing", "Croutons", "Parmesan cheese"]
   *                 allergens: ["Dairy", "Eggs"]
   *     responses:
   *       '201':
   *         description: Menu item created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/MenuItem'
   *       '400':
   *         description: Validation error
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Restaurant or category not found
   */
  router.post(
    "/:restaurantId/menu-items",
    auth([]),
    validation(validators.createMenuItemValidation),
    menuItemController.createMenuItem
  );

  /**
   * @swagger
   * /restaurants/{restaurantId}/menu-items:
   *   get:
   *     tags:
   *       - Menu Items
   *     summary: Get restaurant menu items
   *     description: Get all menu items for a specific restaurant with filtering options
   *     parameters:
   *       - name: restaurantId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174001"
   *       - name: categoryId
   *         in: query
   *         required: false
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174002"
   *         description: Filter by category
   *       - name: available
   *         in: query
   *         required: false
   *         schema:
   *           type: boolean
   *           default: true
   *           example: true
   *         description: Filter by availability
   *       - name: page
   *         in: query
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *       - name: limit
   *         in: query
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *     responses:
   *       '200':
   *         description: Menu items retrieved successfully
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
   *                         items:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/MenuItem'
   *                         pagination:
   *                           $ref: '#/components/schemas/PaginationMeta'
   *             example:
   *               success: true
   *               message: "Menu items retrieved successfully"
   *               data:
   *                 items:
   *                   - id: "123e4567-e89b-12d3-a456-426614174005"
   *                     name: "Margherita Pizza"
   *                     description: "Classic pizza with fresh ingredients"
   *                     price: 14.99
   *                     isAvailable: true
   *                     preparationTime: 15
   *                 pagination:
   *                   page: 1
   *                   limit: 20
   *                   total: 25
   *                   totalPages: 2
   *       '404':
   *         description: Restaurant not found
   */
  router.get("/:restaurantId/menu-items", menuItemController.getMenuItems);

  /**
   * @swagger
   * /restaurants/menu-items/{id}:
   *   put:
   *     tags:
   *       - Menu Items
   *     summary: Update menu item
   *     description: Update an existing menu item
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174005"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Updated Margherita Pizza"
   *               description:
   *                 type: string
   *                 example: "Updated classic pizza with premium fresh ingredients"
   *               price:
   *                 type: number
   *                 example: 16.99
   *               isAvailable:
   *                 type: boolean
   *                 example: true
   *               preparationTime:
   *                 type: integer
   *                 example: 18
   *               ingredients:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: ["Premium tomato sauce", "Buffalo mozzarella", "Fresh basil"]
   *               allergens:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: ["Gluten", "Dairy"]
   *     responses:
   *       '200':
   *         description: Menu item updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/MenuItem'
   *       '400':
   *         description: Validation error
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Menu item not found
   */
  router.put(
    "/menu-items/:id",
    auth([]),
    validation(validators.updateMenuItemValidation),
    menuItemController.updateMenuItem
  );

  /**
   * @swagger
   * /restaurants/menu-items/{id}:
   *   delete:
   *     tags:
   *       - Menu Items
   *     summary: Delete menu item
   *     description: Delete a menu item
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "123e4567-e89b-12d3-a456-426614174005"
   *     responses:
   *       '200':
   *         description: Menu item deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Menu item not found
   */
  router.delete("/menu-items/:id", auth([]), menuItemController.deleteMenuItem);

  // MENU ITEM IMAGES
  router.post(
    "/menu-items/:menuItemId/images",
    auth([]),
    validation(validators.createMenuItemImageValidation),
    menuItemController.addImage
  );
  router.get("/menu-items/:menuItemId/images", menuItemController.getImages);
  router.put(
    "/menu-items/images/:imageId",
    auth([]),
    validation(validators.updateMenuItemImageValidation),
    menuItemController.updateImage
  );
  router.delete(
    "/menu-items/images/:imageId",
    auth([]),
    validation(validators.deleteMenuItemImageValidation),
    menuItemController.deleteImage
  );

  return router;
};

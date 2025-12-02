import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rare Restaurant API',
      version: '1.0.0',
      description: 'Complete API documentation for Rare Restaurant food delivery application with comprehensive endpoints for restaurants, orders, users, and admin operations.',
      contact: {
        name: 'API Support',
        email: 'support@rarerestaurant.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.rarerestaurant.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
        },
      },
      schemas: {
        // Common Response Schemas
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              description: 'Response data object'
            }
          },
          required: ['success', 'message']
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Operation failed'
            },
            errors: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of error messages',
              example: ['Field is required', 'Invalid email format']
            }
          },
          required: ['success', 'message']
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1,
              description: 'Current page number'
            },
            limit: {
              type: 'integer',
              example: 10,
              description: 'Items per page'
            },
            total: {
              type: 'integer',
              example: 100,
              description: 'Total number of items'
            },
            totalPages: {
              type: 'integer',
              example: 10,
              description: 'Total number of pages'
            }
          }
        },

        // User Related Schemas
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'Unique user identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
              description: 'User email address'
            },
            firstName: {
              type: 'string',
              example: 'John',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              example: 'Doe',
              description: 'User last name'
            },
            phone: {
              type: 'string',
              example: '+1234567890',
              description: 'User phone number'
            },
            profilePicture: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/profile.jpg',
              description: 'Profile picture URL'
            },
            role: {
              type: 'string',
              enum: ['customer', 'admin', 'owner', 'manager', 'delivery', 'staff', 'system'],
              example: 'customer',
              description: 'User role'
            },
            isActive: {
              type: 'boolean',
              example: true,
              description: 'User account status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        UserSignup: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName', 'phone'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'SecurePassword123',
              description: 'User password (minimum 6 characters)'
            },
            firstName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'John',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Doe',
              description: 'User last name'
            },
            phone: {
              type: 'string',
              example: '+1234567890',
              description: 'User phone number'
            },
            role: {
              type: 'string',
              enum: ['customer', 'admin', 'owner', 'manager', 'delivery', 'staff'],
              default: 'customer',
              example: 'customer',
              description: 'User role (defaults to customer)'
            }
          }
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
              description: 'User email address'
            },
            password: {
              type: 'string',
              example: 'SecurePassword123',
              description: 'User password'
            }
          }
        },
        UserProfile: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'John',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Doe',
              description: 'User last name'
            },
            phone: {
              type: 'string',
              example: '+1234567890',
              description: 'User phone number'
            },
            profilePicture: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/profile.jpg',
              description: 'Profile picture URL'
            }
          }
        },
        ChangePassword: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: {
              type: 'string',
              example: 'CurrentPassword123',
              description: 'Current password'
            },
            newPassword: {
              type: 'string',
              minLength: 6,
              example: 'NewSecurePassword123',
              description: 'New password (minimum 6 characters)'
            }
          }
        },

        // Restaurant Related Schemas
        Restaurant: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174001',
              description: 'Restaurant unique identifier'
            },
            name: {
              type: 'string',
              example: 'Pizza Palace',
              description: 'Restaurant name'
            },
            description: {
              type: 'string',
              example: 'Authentic Italian pizza and pasta restaurant',
              description: 'Restaurant description'
            },
            address: {
              type: 'string',
              example: '123 Main Street, City, State 12345',
              description: 'Restaurant physical address'
            },
            phone: {
              type: 'string',
              example: '+1234567890',
              description: 'Restaurant contact phone'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'contact@pizzapalace.com',
              description: 'Restaurant contact email'
            },
            image: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/restaurant.jpg',
              description: 'Restaurant image URL'
            },
            openingHours: {
              type: 'string',
              example: '9:00 AM - 11:00 PM',
              description: 'Restaurant operating hours'
            },
            deliveryFee: {
              type: 'number',
              format: 'float',
              minimum: 0,
              example: 2.99,
              description: 'Delivery fee amount'
            },
            minimumOrder: {
              type: 'number',
              format: 'float',
              minimum: 0,
              example: 15.00,
              description: 'Minimum order amount'
            },
            isActive: {
              type: 'boolean',
              example: true,
              description: 'Restaurant active status'
            },
            rating: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 5,
              example: 4.5,
              description: 'Average restaurant rating'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        RestaurantCreate: {
          type: 'object',
          required: ['name', 'description', 'address', 'phone', 'email'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Pizza Palace',
              description: 'Restaurant name'
            },
            description: {
              type: 'string',
              minLength: 10,
              maxLength: 500,
              example: 'Authentic Italian pizza and pasta restaurant serving fresh ingredients',
              description: 'Restaurant description'
            },
            address: {
              type: 'string',
              minLength: 10,
              maxLength: 200,
              example: '123 Main Street, City, State 12345',
              description: 'Restaurant physical address'
            },
            phone: {
              type: 'string',
              example: '+1234567890',
              description: 'Restaurant contact phone'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'contact@pizzapalace.com',
              description: 'Restaurant contact email'
            },
            image: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/restaurant.jpg',
              description: 'Restaurant image URL'
            },
            openingHours: {
              type: 'string',
              example: '9:00 AM - 11:00 PM',
              description: 'Restaurant operating hours'
            },
            deliveryFee: {
              type: 'number',
              format: 'float',
              minimum: 0,
              example: 2.99,
              description: 'Delivery fee amount'
            },
            minimumOrder: {
              type: 'number',
              format: 'float',
              minimum: 0,
              example: 15.00,
              description: 'Minimum order amount'
            }
          }
        },

        // Category Schemas
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174002',
              description: 'Category unique identifier'
            },
            name: {
              type: 'string',
              example: 'Pizza',
              description: 'Category name'
            },
            description: {
              type: 'string',
              example: 'Delicious hand-tossed pizzas with fresh toppings',
              description: 'Category description'
            },
            image: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/category.jpg',
              description: 'Category image URL'
            },
            isActive: {
              type: 'boolean',
              example: true,
              description: 'Category active status'
            },
            sortOrder: {
              type: 'integer',
              example: 1,
              description: 'Category display order'
            },
            restaurantId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174001',
              description: 'Associated restaurant ID'
            }
          }
        },
        CategoryCreate: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Pizza',
              description: 'Category name'
            },
            description: {
              type: 'string',
              maxLength: 200,
              example: 'Delicious hand-tossed pizzas with fresh toppings',
              description: 'Category description'
            },
            image: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/category.jpg',
              description: 'Category image URL'
            },
            isActive: {
              type: 'boolean',
              default: true,
              example: true,
              description: 'Category active status'
            },
            sortOrder: {
              type: 'integer',
              default: 0,
              example: 1,
              description: 'Category display order'
            }
          }
        },

        // MenuItem Schemas
        MenuItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174003',
              description: 'Menu item unique identifier'
            },
            name: {
              type: 'string',
              example: 'Margherita Pizza',
              description: 'Menu item name'
            },
            description: {
              type: 'string',
              example: 'Fresh tomato sauce, mozzarella cheese, and basil',
              description: 'Menu item description'
            },
            price: {
              type: 'number',
              format: 'float',
              example: 12.99,
              description: 'Menu item price'
            },
            image: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/pizza.jpg',
              description: 'Menu item image URL'
            },
            isAvailable: {
              type: 'boolean',
              example: true,
              description: 'Menu item availability'
            },
            preparationTime: {
              type: 'integer',
              example: 20,
              description: 'Preparation time in minutes'
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Tomato sauce', 'Mozzarella cheese', 'Fresh basil'],
              description: 'List of ingredients'
            },
            allergens: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Gluten', 'Dairy'],
              description: 'List of allergens'
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174002',
              description: 'Associated category ID'
            },
            restaurantId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174001',
              description: 'Associated restaurant ID'
            }
          }
        },
        MenuItemCreate: {
          type: 'object',
          required: ['name', 'price', 'categoryId'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Margherita Pizza',
              description: 'Menu item name'
            },
            description: {
              type: 'string',
              maxLength: 500,
              example: 'Fresh tomato sauce, mozzarella cheese, and basil',
              description: 'Menu item description'
            },
            price: {
              type: 'number',
              format: 'float',
              minimum: 0,
              example: 12.99,
              description: 'Menu item price'
            },
            image: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/pizza.jpg',
              description: 'Menu item image URL'
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174002',
              description: 'Associated category ID'
            },
            isAvailable: {
              type: 'boolean',
              default: true,
              example: true,
              description: 'Menu item availability'
            },
            preparationTime: {
              type: 'integer',
              minimum: 0,
              example: 20,
              description: 'Preparation time in minutes'
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Tomato sauce', 'Mozzarella cheese', 'Fresh basil'],
              description: 'List of ingredients'
            },
            allergens: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Gluten', 'Dairy'],
              description: 'List of allergens'
            }
          }
        },

        // Address Schemas
        Address: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174004',
              description: 'Address unique identifier'
            },
            label: {
              type: 'string',
              example: 'Home',
              description: 'Address label (Home, Work, etc.)'
            },
            street: {
              type: 'string',
              example: '123 Main Street',
              description: 'Street address'
            },
            city: {
              type: 'string',
              example: 'New York',
              description: 'City name'
            },
            state: {
              type: 'string',
              example: 'NY',
              description: 'State or province'
            },
            zipCode: {
              type: 'string',
              example: '10001',
              description: 'ZIP or postal code'
            },
            country: {
              type: 'string',
              example: 'USA',
              description: 'Country name'
            },
            isPrimary: {
              type: 'boolean',
              example: true,
              description: 'Primary address flag'
            },
            userId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'Associated user ID'
            }
          }
        },
        AddressCreate: {
          type: 'object',
          required: ['label', 'street', 'city', 'state', 'zipCode'],
          properties: {
            label: {
              type: 'string',
              minLength: 1,
              maxLength: 50,
              example: 'Home',
              description: 'Address label (Home, Work, etc.)'
            },
            street: {
              type: 'string',
              minLength: 5,
              maxLength: 100,
              example: '123 Main Street',
              description: 'Street address'
            },
            city: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'New York',
              description: 'City name'
            },
            state: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'NY',
              description: 'State or province'
            },
            zipCode: {
              type: 'string',
              minLength: 3,
              maxLength: 20,
              example: '10001',
              description: 'ZIP or postal code'
            },
            country: {
              type: 'string',
              default: 'USA',
              example: 'USA',
              description: 'Country name'
            }
          }
        },

        // Cart Schemas
        Cart: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174005',
              description: 'Cart unique identifier'
            },
            userId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'Associated user ID'
            },
            restaurantId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174001',
              description: 'Associated restaurant ID'
            },
            totalItems: {
              type: 'integer',
              example: 3,
              description: 'Total number of items in cart'
            },
            subtotal: {
              type: 'number',
              format: 'float',
              example: 35.97,
              description: 'Cart subtotal amount'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CartItem'
              },
              description: 'Cart items'
            }
          }
        },
        CartItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174006',
              description: 'Cart item unique identifier'
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              example: 2,
              description: 'Item quantity'
            },
            price: {
              type: 'number',
              format: 'float',
              example: 12.99,
              description: 'Item price at time of adding'
            },
            subtotal: {
              type: 'number',
              format: 'float',
              example: 25.98,
              description: 'Item subtotal (price * quantity)'
            },
            specialInstructions: {
              type: 'string',
              example: 'Extra cheese, no onions',
              description: 'Special preparation instructions'
            },
            menuItem: {
              $ref: '#/components/schemas/MenuItem',
              description: 'Associated menu item'
            }
          }
        },
        CartItemAdd: {
          type: 'object',
          required: ['menuItemId', 'quantity'],
          properties: {
            menuItemId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174003',
              description: 'Menu item ID to add'
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              maximum: 99,
              example: 2,
              description: 'Item quantity'
            },
            specialInstructions: {
              type: 'string',
              maxLength: 500,
              example: 'Extra cheese, no onions',
              description: 'Special preparation instructions'
            }
          }
        },

        // Order Schemas
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174007',
              description: 'Order unique identifier'
            },
            orderNumber: {
              type: 'string',
              example: 'ORD-20240115-0001',
              description: 'Human-readable order number'
            },
            userId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'Customer user ID'
            },
            restaurantId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174001',
              description: 'Restaurant ID'
            },
            deliveryAddressId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174004',
              description: 'Delivery address ID'
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
              example: 'pending',
              description: 'Order status'
            },
            paymentMethod: {
              type: 'string',
              enum: ['credit_card', 'debit_card', 'cash', 'digital_wallet'],
              example: 'credit_card',
              description: 'Payment method used'
            },
            subtotal: {
              type: 'number',
              format: 'float',
              example: 35.97,
              description: 'Order subtotal'
            },
            tax: {
              type: 'number',
              format: 'float',
              example: 3.60,
              description: 'Tax amount'
            },
            deliveryFee: {
              type: 'number',
              format: 'float',
              example: 2.99,
              description: 'Delivery fee'
            },
            total: {
              type: 'number',
              format: 'float',
              example: 42.56,
              description: 'Total order amount'
            },
            specialInstructions: {
              type: 'string',
              example: 'Please ring the doorbell',
              description: 'Special delivery instructions'
            },
            estimatedDeliveryTime: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T12:30:00.000Z',
              description: 'Estimated delivery time'
            },
            actualDeliveryTime: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T12:25:00.000Z',
              description: 'Actual delivery time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T11:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T11:35:00.000Z'
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItem'
              },
              description: 'Order items'
            }
          }
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174008',
              description: 'Order item unique identifier'
            },
            quantity: {
              type: 'integer',
              example: 2,
              description: 'Item quantity'
            },
            price: {
              type: 'number',
              format: 'float',
              example: 12.99,
              description: 'Item price at time of order'
            },
            subtotal: {
              type: 'number',
              format: 'float',
              example: 25.98,
              description: 'Item subtotal'
            },
            specialInstructions: {
              type: 'string',
              example: 'Extra cheese',
              description: 'Special preparation instructions'
            },
            menuItem: {
              $ref: '#/components/schemas/MenuItem',
              description: 'Associated menu item'
            }
          }
        },
        OrderCreate: {
          type: 'object',
          required: ['restaurantId', 'deliveryAddressId', 'paymentMethod', 'items'],
          properties: {
            restaurantId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174001',
              description: 'Restaurant ID'
            },
            deliveryAddressId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174004',
              description: 'Delivery address ID'
            },
            paymentMethod: {
              type: 'string',
              enum: ['credit_card', 'debit_card', 'cash', 'digital_wallet'],
              example: 'credit_card',
              description: 'Payment method'
            },
            specialInstructions: {
              type: 'string',
              maxLength: 1000,
              example: 'Please ring the doorbell and call when you arrive',
              description: 'Special delivery instructions'
            },
            items: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: ['menuItemId', 'quantity', 'price'],
                properties: {
                  menuItemId: {
                    type: 'string',
                    format: 'uuid',
                    example: '123e4567-e89b-12d3-a456-426614174003',
                    description: 'Menu item ID'
                  },
                  quantity: {
                    type: 'integer',
                    minimum: 1,
                    example: 2,
                    description: 'Item quantity'
                  },
                  price: {
                    type: 'number',
                    format: 'float',
                    example: 12.99,
                    description: 'Item price'
                  },
                  specialInstructions: {
                    type: 'string',
                    maxLength: 500,
                    example: 'Extra cheese',
                    description: 'Special preparation instructions'
                  }
                }
              },
              description: 'Order items'
            }
          }
        },
        OrderStatusUpdate: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
              example: 'preparing',
              description: 'New order status'
            },
            note: {
              type: 'string',
              maxLength: 500,
              example: 'Order is being prepared by the kitchen',
              description: 'Status update note'
            },
            estimatedDeliveryTime: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T12:30:00.000Z',
              description: 'Updated estimated delivery time'
            }
          }
        },
        OrderInput: {
          type: 'object',
          required: ['cartId', 'paymentMethod', 'orderType'],
          properties: {
            cartId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'Shopping cart ID to create order from'
            },
            deliveryAddressId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174001',
              description: 'Delivery address ID (required for delivery orders)'
            },
            paymentMethod: {
              type: 'string',
              enum: ['credit_card', 'debit_card', 'cash', 'digital_wallet'],
              example: 'credit_card',
              description: 'Payment method for the order'
            },
            orderType: {
              type: 'string',
              enum: ['delivery', 'pickup'],
              example: 'delivery',
              description: 'Type of order (delivery or pickup)'
            },
            notes: {
              type: 'string',
              maxLength: 1000,
              example: 'Please ring the doorbell',
              description: 'Special instructions for the order'
            }
          }
        },
        OrderStatusHistory: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'status-001',
              description: 'Status history entry ID'
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
              example: 'confirmed',
              description: 'Order status'
            },
            notes: {
              type: 'string',
              example: 'Order confirmed by restaurant',
              description: 'Status change notes'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T18:32:00.000Z',
              description: 'When status was updated'
            },
            updatedBy: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid'
                },
                name: {
                  type: 'string'
                },
                role: {
                  type: 'string'
                }
              },
              description: 'User who updated the status'
            },
            estimatedNextUpdate: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T19:00:00.000Z',
              description: 'Estimated time for next status update'
            }
          }
        },
        AddressInput: {
          type: 'object',
          required: ['name', 'street', 'city', 'state', 'zipCode', 'country'],
          properties: {
            name: {
              type: 'string',
              maxLength: 100,
              example: 'Home',
              description: 'Address name/label'
            },
            street: {
              type: 'string',
              maxLength: 255,
              example: '123 Main Street',
              description: 'Street address'
            },
            city: {
              type: 'string',
              maxLength: 100,
              example: 'New York',
              description: 'City name'
            },
            state: {
              type: 'string',
              maxLength: 100,
              example: 'NY',
              description: 'State or province'
            },
            zipCode: {
              type: 'string',
              maxLength: 20,
              example: '10001',
              description: 'ZIP or postal code'
            },
            country: {
              type: 'string',
              maxLength: 100,
              example: 'USA',
              description: 'Country name'
            },
            phone: {
              type: 'string',
              maxLength: 20,
              example: '+1234567890',
              description: 'Contact phone number'
            },
            isDefault: {
              type: 'boolean',
              example: true,
              description: 'Whether this is the default address'
            },
            apartment: {
              type: 'string',
              maxLength: 50,
              example: 'Apt 4B',
              description: 'Apartment, suite, or unit number'
            },
            instructions: {
              type: 'string',
              maxLength: 500,
              example: 'Ring doorbell twice',
              description: 'Delivery instructions'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User profile and account management'
      },
      {
        name: 'Restaurants',
        description: 'Restaurant management and information'
      },
      {
        name: 'Categories',
        description: 'Menu category management'
      },
      {
        name: 'Menu Items',
        description: 'Menu item management'
      },
      {
        name: 'Addresses',
        description: 'User address management'
      },
      {
        name: 'Cart',
        description: 'Shopping cart operations'
      },
      {
        name: 'Orders',
        description: 'Order management and tracking'
      },
      {
        name: 'Order Items',
        description: 'Order item details and calculations'
      },
      {
        name: 'Order Status',
        description: 'Order status tracking and history'
      },
      {
        name: 'Admin',
        description: 'Administrative operations and analytics'
      }
    ]
  },
  apis: [
    './src/modules/**/*.controller.ts',
    './src/modules/**/*.routes.ts',
    './src/swagger/**/*.yaml',
  ],
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Rare Restaurant API Documentation',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
    }
  }));

  // Serve swagger spec as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export default specs;
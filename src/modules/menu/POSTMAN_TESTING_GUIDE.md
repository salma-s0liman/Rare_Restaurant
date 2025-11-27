# 📋 Postman Testing Guide - Module 2: Menu Browsing with Categories

## 🌐 Base URL

```
http://localhost:3000
```

## 🏥 **HEALTH CHECK**

### **Server Health Check**

```http
GET {{base_url}}/health
```

**Purpose:** Check if the server and database are running properly

**Expected Response (200 - Healthy):**

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "OK",
    "timestamp": "2025-11-26T19:41:18.123Z",
    "uptime": 12.345,
    "application": {
      "name": "Rare Restaurant",
      "version": "1.0.0",
      "environment": "development"
    },
    "database": {
      "connected": true,
      "initialized": true,
      "type": "mysql"
    },
    "server": {
      "port": "3000",
      "memory": {
        "used": "25 MB",
        "total": "50 MB"
      }
    }
  }
}
```

**Expected Response (503 - Database Issues):**

```json
{
  "success": false,
  "message": "Server is running but database connection issues detected",
  "data": {
    "status": "DEGRADED",
    "timestamp": "2025-11-26T19:41:18.123Z",
    "uptime": 12.345,
    "application": {
      "name": "Rare Restaurant",
      "version": "1.0.0",
      "environment": "development"
    },
    "database": {
      "connected": false,
      "initialized": true,
      "type": "mysql",
      "error": "Connection timeout"
    },
    "server": {
      "port": "3000",
      "memory": {
        "used": "25 MB",
        "total": "50 MB"
      }
    }
  }
}
```

**Test this first to ensure your server is running correctly!**

---

## 📁 Collection Structure

Create a new Postman collection called "Rare Restaurant - Menu Module" with the following folders:

- **Public - Restaurants**
- **Public - Menu Items**
- **Admin - Menu Management**
- **Admin - Categories**
- **Admin - Images**

---

## 🏪 **PUBLIC ROUTES**

### 1. **Get All Restaurants**

```http
GET {{base_url}}/api/restaurants
```

**Query Parameters (Optional):**

- `is_active`: `true` or `false`
- `page`: `1` (default)
- `limit`: `10` (default)

**Example URLs:**

```
GET /api/restaurants
GET /api/restaurants?is_active=true&page=1&limit=5
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Restaurants retrieved successfully",
  "data": {
    "restaurants": [
      {
        "id": "uuid",
        "name": "Restaurant Name",
        "address": "123 Main St",
        "phone": "+1234567890",
        "is_active": true,
        "categories_count": 5,
        "menu_items_count": 25
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 2. **Get Restaurant Details**

```http
GET {{base_url}}/api/restaurants/{{restaurant_id}}
```

**Path Variables:**

- `restaurant_id`: `uuid` (required)

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Restaurant details retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Restaurant Name",
    "address": "123 Main St",
    "phone": "+1234567890",
    "currency": "USD",
    "is_active": true,
    "created_at": "2025-11-26T19:00:00.000Z",
    "categories_count": 5,
    "menu_items_count": 25
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Restaurant not found"
}
```

---

### 3. **Get Restaurant Menu**

```http
GET {{base_url}}/api/restaurants/{{restaurant_id}}/menu
```

**Path Variables:**

- `restaurant_id`: `uuid` (required)

**Query Parameters (Optional):**

- `category_id`: `uuid`
- `min_price`: `10.50`
- `max_price`: `50.00`
- `available_only`: `true` or `false`
- `search`: `pizza`
- `page`: `1` (default)
- `limit`: `10` (default)

**Example URLs:**

```
GET /api/restaurants/123/menu
GET /api/restaurants/123/menu?category_id=456&min_price=10&max_price=30
GET /api/restaurants/123/menu?search=pizza&available_only=true
GET /api/restaurants/123/menu?page=2&limit=5
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Restaurant menu retrieved successfully",
  "data": {
    "restaurant": {
      "id": "uuid",
      "name": "Restaurant Name",
      "address": "123 Main St",
      "phone": "+1234567890",
      "is_active": true
    },
    "categories": [
      {
        "id": "uuid",
        "name": "Appetizers",
        "description": "Start your meal right",
        "items_count": 8,
        "menu_items": []
      }
    ],
    "menu_items": [
      {
        "id": "uuid",
        "name": "Margherita Pizza",
        "description": "Fresh mozzarella, tomato sauce, basil",
        "price": 18.99,
        "is_available": true,
        "created_at": "2025-11-26T19:00:00.000Z",
        "category": {
          "id": "uuid",
          "name": "Pizza",
          "description": "Wood-fired pizzas"
        },
        "images": [
          {
            "id": "uuid",
            "url": "https://example.com/pizza1.jpg",
            "alt_text": "Margherita Pizza",
            "is_primary": true
          }
        ],
        "restaurant": {
          "id": "uuid",
          "name": "Restaurant Name"
        }
      }
    ],
    "total_items": 25,
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

### 4. **Get Menu Item Details**

```http
GET {{base_url}}/api/menu-items/{{menu_item_id}}
```

**Path Variables:**

- `menu_item_id`: `uuid` (required)

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Menu item details retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Margherita Pizza",
    "description": "Fresh mozzarella, tomato sauce, basil",
    "price": 18.99,
    "is_available": true,
    "created_at": "2025-11-26T19:00:00.000Z",
    "category": {
      "id": "uuid",
      "name": "Pizza",
      "description": "Wood-fired pizzas"
    },
    "images": [
      {
        "id": "uuid",
        "url": "https://example.com/pizza1.jpg",
        "alt_text": "Margherita Pizza",
        "is_primary": true
      }
    ],
    "restaurant": {
      "id": "uuid",
      "name": "Restaurant Name"
    }
  }
}
```

---

## 🔐 **ADMIN ROUTES**

### 5. **Create Menu Item**

```http
POST {{base_url}}/api/admin/restaurants/{{restaurant_id}}/menu-items
```

**Path Variables:**

- `restaurant_id`: `uuid` (required)

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Pepperoni Pizza",
  "description": "Classic pepperoni with mozzarella cheese",
  "price": 22.99,
  "category_id": "category_uuid",
  "is_available": true
}
```

**Required Fields:**

- `name`: string (max 200 chars)
- `price`: number (positive)
- `category_id`: uuid

**Optional Fields:**

- `description`: string
- `is_available`: boolean (default: true)

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Menu item created successfully",
  "data": {
    "id": "new_uuid",
    "name": "Pepperoni Pizza",
    "description": "Classic pepperoni with mozzarella cheese",
    "price": 22.99,
    "is_available": true,
    "created_at": "2025-11-26T19:00:00.000Z",
    "category": {
      "id": "uuid",
      "name": "Pizza",
      "description": "Wood-fired pizzas"
    },
    "images": [],
    "restaurant": {
      "id": "uuid",
      "name": "Restaurant Name"
    }
  }
}
```

---

### 6. **Update Menu Item**

```http
PUT {{base_url}}/api/admin/menu-items/{{menu_item_id}}
```

**Path Variables:**

- `menu_item_id`: `uuid` (required)

**Headers:**

```
Content-Type: application/json
```

**Request Body (all fields optional):**

```json
{
  "name": "Updated Pizza Name",
  "description": "Updated description",
  "price": 24.99,
  "category_id": "new_category_uuid",
  "is_available": false
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Menu item updated successfully",
  "data": {
    // Updated menu item object
  }
}
```

---

### 7. **Delete Menu Item**

```http
DELETE {{base_url}}/api/admin/menu-items/{{menu_item_id}}
```

**Path Variables:**

- `menu_item_id`: `uuid` (required)

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Menu item deleted successfully",
  "data": null
}
```

---

### 8. **Create Category**

```http
POST {{base_url}}/api/admin/restaurants/{{restaurant_id}}/categories
```

**Path Variables:**

- `restaurant_id`: `uuid` (required)

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Desserts",
  "description": "Sweet treats to end your meal"
}
```

**Required Fields:**

- `name`: string (max 150 chars)

**Optional Fields:**

- `description`: string

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "new_uuid",
    "name": "Desserts",
    "description": "Sweet treats to end your meal"
  }
}
```

---

### 9. **Add Menu Item Image**

```http
POST {{base_url}}/api/admin/menu-items/{{menu_item_id}}/images
```

**Path Variables:**

- `menu_item_id`: `uuid` (required)

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "url": "https://example.com/dessert1.jpg",
  "alt_text": "Chocolate Cake",
  "is_primary": true
}
```

**Required Fields:**

- `url`: string (max 1000 chars, valid URL)

**Optional Fields:**

- `alt_text`: string (max 255 chars)
- `is_primary`: boolean (default: false)

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Image added successfully",
  "data": {
    "id": "new_uuid",
    "url": "https://example.com/dessert1.jpg",
    "alt_text": "Chocolate Cake",
    "is_primary": true,
    "created_at": "2025-11-26T19:00:00.000Z"
  }
}
```

---

### 10. **Remove Menu Item Image**

```http
DELETE {{base_url}}/api/admin/images/{{image_id}}
```

**Path Variables:**

- `image_id`: `uuid` (required)

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Image removed successfully",
  "data": null
}
```

---

## 🚨 **Common Error Responses**

### **400 - Bad Request**

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "name": "Name is required",
    "price": "Price must be a positive number"
  }
}
```

### **404 - Not Found**

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### **500 - Server Error**

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🧪 **Testing Workflow**

### **Step 1: Setup Environment**

1. Create environment variables in Postman:
   - `base_url`: `http://localhost:3000`
   - `restaurant_id`: (you'll get this from step 2)
   - `menu_item_id`: (you'll get this from step 4)
   - `category_id`: (you'll get this from step 6)

### **Step 2: Test Public Endpoints**

1. **Get All Restaurants** → Save a `restaurant_id`
2. **Get Restaurant Details** → Verify restaurant exists
3. **Get Restaurant Menu** → Check if menu items exist
4. **Get Menu Item Details** → Save a `menu_item_id`

### **Step 3: Test Admin Endpoints**

1. **Create Category** → Save `category_id`
2. **Create Menu Item** → Use the `category_id` from step 1
3. **Add Menu Item Image** → Add image to the menu item
4. **Update Menu Item** → Modify the created item
5. **Get Restaurant Menu** → Verify changes
6. **Delete Menu Item Image** → Remove an image
7. **Delete Menu Item** → Clean up

### **Step 4: Test Filtering & Pagination**

1. Test menu filtering by category, price range, availability
2. Test search functionality
3. Test pagination with different page sizes
4. Test edge cases (invalid IDs, missing parameters)

---

## 📝 **Quick Test Script**

Save this as a Postman pre-request script to generate test data:

```javascript
// Generate test UUIDs for path variables
pm.environment.set(
  "test_restaurant_id",
  "00000000-0000-0000-0000-000000000001"
);
pm.environment.set("test_menu_item_id", "00000000-0000-0000-0000-000000000002");
pm.environment.set("test_category_id", "00000000-0000-0000-0000-000000000003");
```

## 🎯 **Success Criteria**

- ✅ All public endpoints return data without authentication
- ✅ Admin endpoints can create, read, update, delete resources
- ✅ Filtering and pagination work correctly
- ✅ Error handling returns appropriate status codes
- ✅ Data validation prevents invalid inputs
- ✅ Relationships between restaurants, categories, and menu items work

Happy Testing! 🚀

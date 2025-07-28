# Controller Pattern Guide

## 🏗️ Cấu trúc Controller Pattern

### 1. BaseController (Abstract Class)

- Cung cấp các methods CRUD cơ bản
- Xử lý lỗi chung và response format
- Validation helpers
- Query options builder

### 2. Specific Controllers

- Kế thừa từ BaseController
- Thêm các methods đặc biệt cho từng entity
- Business logic cụ thể

## 📝 Cách sử dụng

### Tạo Controller đơn giản:

```javascript
const BaseController = require("./BaseController");
const ProductModel = require("../models/ProductModel");

class ProductController extends BaseController {
  constructor() {
    super(new ProductModel());
  }
}

module.exports = ProductController;
```

### Sử dụng trong Routes:

```javascript
const express = require("express");
const UserController = require("../controllers/UserController");

const router = express.Router();
const userController = new UserController();

// CRUD routes (từ BaseController)
router.get("/users", (req, res) => userController.getAll(req, res));
router.get("/users/:id", (req, res) => userController.getById(req, res));
router.post("/users", (req, res) => userController.create(req, res));
router.put("/users/:id", (req, res) => userController.update(req, res));
router.delete("/users/:id", (req, res) => userController.delete(req, res));

// Custom routes
router.get("/users/with-profiles", (req, res) =>
  userController.getAllWithProfiles(req, res)
);
router.get("/users/email/:email", (req, res) =>
  userController.findByEmail(req, res)
);
router.post("/users/with-profile", (req, res) =>
  userController.createWithProfile(req, res)
);

module.exports = router;
```

## 🔧 Methods có sẵn từ BaseController

### CRUD Operations:

```javascript
// Lấy tất cả
GET /api/users
GET /api/users?limit=10&offset=0&orderBy=created_at DESC

// Lấy theo ID
GET /api/users/:id

// Tạo mới
POST /api/users
{
    "email": "user@example.com",
    "username": "user123",
    "first_name": "John",
    "last_name": "Doe"
}

// Cập nhật
PUT /api/users/:id
{
    "first_name": "Jane"
}

// Xóa (soft delete)
DELETE /api/users/:id

// Xóa vĩnh viễn
DELETE /api/users/:id/destroy

// Tìm kiếm
GET /api/users/search?keyword=john&role=user

// Đếm
GET /api/users/count?status=active
```

## 🚀 Response Format

### Success Response:

```json
{
    "success": true,
    "data": [...],
    "message": "Operation completed successfully"
}
```

### Error Response:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Stack trace (development only)"
}
```

## 🔍 Query Parameters

### Pagination:

```
?limit=10&offset=0
```

### Sorting:

```
?orderBy=created_at DESC
?orderBy=name ASC
```

### Filtering:

```
?where=status = $1 AND role = $2&params=active,user
```

### Search:

```
?keyword=search_term
```

## ✅ Validation Features

### Required Fields:

```javascript
this.validateRequiredFields(req, ["email", "username", "password"]);
```

### ID Validation:

```javascript
this.validateId(req.params.id);
```

### Custom Validation:

```javascript
if (!email || !email.includes("@")) {
  throw {
    statusCode: 400,
    message: "Invalid email format",
  };
}
```

## 🛡️ Error Handling

### Automatic Error Handling:

- Database errors
- Validation errors
- Not found errors
- Custom business logic errors

### Error Types:

- `400`: Bad Request (validation errors)
- `404`: Not Found (record not found)
- `500`: Internal Server Error (database/server errors)

## 📊 Advanced Features

### Custom Methods:

```javascript
class UserController extends BaseController {
  async activateUser(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const user = await this.model.update(id, {
        status: "active",
        email_verified: true,
      });

      res.json({
        success: true,
        data: user,
        message: "User activated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to activate user");
    }
  }
}
```

### Transaction Support:

```javascript
async createWithProfile(req, res) {
    try {
        const userData = req.body;
        const profileData = req.body.profile;

        const user = await this.model.createWithProfile(userData, profileData);

        res.status(201).json({
            success: true,
            data: user,
            message: 'User created with profile successfully'
        });
    } catch (error) {
        this.handleError(res, error, 'Failed to create user with profile');
    }
}
```

## 🚀 Lợi ích của Pattern này

### ✅ **Consistency:**

- Response format nhất quán
- Error handling thống nhất
- Code structure đồng nhất

### ✅ **Maintainability:**

- DRY principle
- Easy to extend
- Clear separation of concerns

### ✅ **Developer Experience:**

- JSDoc documentation
- Type hints
- Consistent API responses
- Easy debugging

### ✅ **Performance:**

- Optimized queries
- Connection pooling
- Efficient error handling

## 📊 So sánh với các cách khác

| Feature         | Callback Style  | Async/Await | BaseController Pattern |
| --------------- | --------------- | ----------- | ---------------------- |
| Code Reuse      | ❌ None         | ❌ Limited  | ✅ Maximum             |
| Consistency     | ❌ Poor         | ⚠️ Good     | ✅ Excellent           |
| Error Handling  | ❌ Complex      | ✅ Good     | ✅ Excellent           |
| Validation      | ❌ Manual       | ⚠️ Manual   | ✅ Built-in            |
| Response Format | ❌ Inconsistent | ⚠️ Manual   | ✅ Consistent          |
| Maintainability | ❌ Poor         | ✅ Good     | ✅ Excellent           |

# Model Pattern Guide

## 🏗️ Cấu trúc Model Pattern

### 1. BaseModel (Abstract Class)

- Cung cấp các methods CRUD cơ bản
- Tự động xử lý SQL injection với parameterized queries
- Hỗ trợ soft delete và hard delete
- Tối ưu cho PostgreSQL

### 2. Specific Models

- Kế thừa từ BaseModel
- Thêm các methods đặc biệt cho từng entity
- Hỗ trợ complex queries và relationships

## 📝 Cách sử dụng

### Tạo Model đơn giản:

```javascript
const BaseModel = require("./BaseModel");

class ProductModel extends BaseModel {
  constructor() {
    super("products", "id");
  }
}

module.exports = ProductModel;
```

### Sử dụng trong Controller:

```javascript
const UserModel = require("../models/UserModel");

class UserController {
  constructor() {
    this.userModel = new UserModel();
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.userModel.findAllWithProfile();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const userData = req.body;
      const profileData = {
        avatar: req.body.avatar,
        bio: req.body.bio,
      };

      const user = await this.userModel.createWithProfile(
        userData,
        profileData
      );
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
```

## 🔧 Methods có sẵn từ BaseModel

### CRUD Operations:

```javascript
// Lấy tất cả
const users = await userModel.findAll();

// Lấy theo ID
const user = await userModel.findById(1);

// Tạo mới
const newUser = await userModel.create({
  name: "John Doe",
  email: "john@example.com",
});

// Cập nhật
const updatedUser = await userModel.update(1, {
  name: "Jane Doe",
});

// Soft delete
await userModel.delete(1);

// Hard delete
await userModel.destroy(1);
```

### Advanced Queries:

```javascript
// Tìm kiếm với điều kiện
const activeUsers = await userModel.findWhere({ status: "active" });

// Lấy với options
const users = await userModel.findAll({
  where: "status = $1 AND role = $2",
  params: ["active", "user"],
  orderBy: "created_at DESC",
  limit: 10,
});

// Đếm records
const count = await userModel.count({
  where: "status = $1",
  params: ["active"],
});
```

## 🚀 Lợi ích của Pattern này

### ✅ **Tối ưu:**

- **DRY Principle**: Không lặp lại code CRUD
- **Performance**: Connection pool và query optimization
- **Security**: Parameterized queries chống SQL injection
- **Maintainability**: Dễ maintain và extend

### ✅ **PostgreSQL Features:**

- **RETURNING clause**: Lấy data ngay sau INSERT/UPDATE
- **ILIKE**: Case-insensitive search
- **NOW()**: Timestamp functions
- **Transaction support**: ACID compliance

### ✅ **Developer Experience:**

- **Type Safety**: JSDoc comments
- **Error Handling**: Consistent error handling
- **Logging**: Query performance monitoring
- **Flexibility**: Easy to customize per model

## 📊 So sánh với các cách khác

| Feature              | Callback Style | Async/Await | BaseModel Pattern |
| -------------------- | -------------- | ----------- | ----------------- |
| Readability          | ❌ Poor        | ✅ Good     | ✅ Excellent      |
| Error Handling       | ❌ Complex     | ✅ Good     | ✅ Excellent      |
| Code Reuse           | ❌ None        | ❌ Limited  | ✅ Maximum        |
| Performance          | ❌ Poor        | ✅ Good     | ✅ Excellent      |
| Maintainability      | ❌ Poor        | ✅ Good     | ✅ Excellent      |
| PostgreSQL Optimized | ❌ No          | ❌ No       | ✅ Yes            |

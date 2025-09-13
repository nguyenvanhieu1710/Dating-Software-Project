# 🧪 API TESTING GUIDE - DATING SOFTWARE

## 📋 Tổng quan
Base URL: `http://localhost:5001/api`

## 🚀 Bước 1: Setup Postman Environment

### Tạo Environment Variables:
1. **Base URL**: `http://localhost:5001/api`
2. **Token**: (sẽ được set sau khi login)
3. **User ID**: (sẽ được set sau khi tạo user)

## 🔐 Bước 2: Test Authentication APIs

### 2.1 Đăng ký User
```
POST {{Base URL}}/user/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "lookingFor": "female"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 2.2 Đăng nhập
```
POST {{Base URL}}/user/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**Lưu token vào environment variable:**
- Copy token từ response
- Set environment variable `Token` = token value

## 👤 Bước 3: Test User APIs

### 3.1 Lấy thông tin user hiện tại
```
GET {{Base URL}}/user/me
Authorization: Bearer {{Token}}
```

### 3.2 Cập nhật thông tin user
```
PUT {{Base URL}}/user/me
Authorization: Bearer {{Token}}
Content-Type: application/json

{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "bio": "This is my updated bio"
}
```

### 3.3 Lấy user theo email
```
GET {{Base URL}}/user/by-email/test@example.com
Authorization: Bearer {{Token}}
```

## 📸 Bước 4: Test Photo APIs

### 4.1 Upload ảnh
```
POST {{Base URL}}/photo/upload
Authorization: Bearer {{Token}}
Content-Type: multipart/form-data

Body (form-data):
- file: [chọn file ảnh]
- type: "profile"
```

### 4.2 Lấy ảnh của user
```
GET {{Base URL}}/photo/by-user/{{User ID}}
Authorization: Bearer {{Token}}
```

### 4.3 Xóa ảnh
```
DELETE {{Base URL}}/photo/{{Photo ID}}
Authorization: Bearer {{Token}}
```

## 👤 Bước 5: Test Profile APIs

### 5.1 Tạo profile
```
POST {{Base URL}}/profile
Authorization: Bearer {{Token}}
Content-Type: application/json

{
  "bio": "I love traveling and meeting new people",
  "interests": ["travel", "music", "sports"],
  "location": {
    "latitude": 10.762622,
    "longitude": 106.660172,
    "city": "Ho Chi Minh City"
  },
  "height": 175,
  "weight": 70,
  "education": "Bachelor's Degree",
  "occupation": "Software Engineer"
}
```

### 5.2 Lấy profile
```
GET {{Base URL}}/profile/by-user/{{User ID}}
Authorization: Bearer {{Token}}
```

### 5.3 Cập nhật profile
```
PUT {{Base URL}}/profile/{{Profile ID}}
Authorization: Bearer {{Token}}
Content-Type: application/json

{
  "bio": "Updated bio",
  "interests": ["travel", "music", "cooking"]
}
```

## 💕 Bước 6: Test Swipe APIs

### 6.1 Swipe right (like)
```
POST {{Base URL}}/swipe
Authorization: Bearer {{Token}}
Content-Type: application/json

{
  "targetUserId": 2,
  "action": "like",
  "message": "Hello! I like your profile"
}
```

### 6.2 Swipe left (pass)
```
POST {{Base URL}}/swipe
Authorization: Bearer {{Token}}
Content-Type: application/json

{
  "targetUserId": 3,
  "action": "pass"
}
```

### 6.3 Lấy danh sách đã swipe
```
GET {{Base URL}}/swipe/by-user/{{User ID}}
Authorization: Bearer {{Token}}
```

## 💬 Bước 7: Test Match APIs

### 7.1 Lấy danh sách matches
```
GET {{Base URL}}/match/by-user/{{User ID}}
Authorization: Bearer {{Token}}
```

### 7.2 Lấy thông tin match cụ thể
```
GET {{Base URL}}/match/{{Match ID}}
Authorization: Bearer {{Token}}
```

## 💬 Bước 8: Test Message APIs

### 8.1 Gửi tin nhắn
```
POST {{Base URL}}/match/{{Match ID}}/messages
Authorization: Bearer {{Token}}
Content-Type: application/json

{
  "content": "Hello! How are you?",
  "type": "text"
}
```

### 8.2 Lấy tin nhắn trong match
```
GET {{Base URL}}/match/{{Match ID}}/messages
Authorization: Bearer {{Token}}
```

### 8.3 Đánh dấu tin nhắn đã đọc
```
PUT {{Base URL}}/match/{{Match ID}}/messages/{{Message ID}}/read
Authorization: Bearer {{Token}}
```

## ⚙️ Bước 9: Test Settings APIs

### 9.1 Tạo settings
```
POST {{Base URL}}/settings
Authorization: Bearer {{Token}}
Content-Type: application/json

{
  "notifications": {
    "matches": true,
    "messages": true,
    "likes": true
  },
  "privacy": {
    "showOnlineStatus": true,
    "showLastSeen": false
  },
  "preferences": {
    "ageRange": {
      "min": 18,
      "max": 35
    },
    "distance": 50,
    "gender": "female"
  }
}
```

### 9.2 Lấy settings
```
GET {{Base URL}}/settings/by-user/{{User ID}}
Authorization: Bearer {{Token}}
```

### 9.3 Cập nhật settings
```
PUT {{Base URL}}/settings/{{Settings ID}}
Authorization: Bearer {{Token}}
Content-Type: application/json

{
  "notifications": {
    "matches": false,
    "messages": true,
    "likes": true
  }
}
```

## 💎 Bước 10: Test Subscription APIs

### 10.1 Tạo subscription
```
POST {{Base URL}}/subscription
Authorization: Bearer {{Token}}
Content-Type: application/json

{
  "plan": "premium",
  "duration": "monthly",
  "paymentMethod": "credit_card"
}
```

### 10.2 Lấy subscription hiện tại
```
GET {{Base URL}}/subscription/by-user/{{User ID}}/current
Authorization: Bearer {{Token}}
```

### 10.3 Hủy subscription
```
DELETE {{Base URL}}/subscription/{{Subscription ID}}
Authorization: Bearer {{Token}}
```

## 🎁 Bước 11: Test Consumable APIs

### 11.1 Sử dụng super like
```
POST {{Base URL}}/consumable/super-like
Authorization: Bearer {{Token}}
Content-Type: application/json

{
  "targetUserId": 2,
  "message": "You're amazing! Super like!"
}
```

### 11.2 Sử dụng boost
```
POST {{Base URL}}/consumable/boost
Authorization: Bearer {{Token}}
Content-Type: application/json

{
  "duration": 30
}
```

### 11.3 Lấy số lượng consumables
```
GET {{Base URL}}/consumable/by-user/{{User ID}}
Authorization: Bearer {{Token}}
```

## 📤 Bước 12: Test Upload APIs

### 12.1 Upload file
```
POST {{Base URL}}/upload/file
Authorization: Bearer {{Token}}
Content-Type: multipart/form-data

Body (form-data):
- file: [chọn file]
- type: "profile"
```

### 12.2 Lấy file
```
GET {{Base URL}}/upload/file/{{File ID}}
Authorization: Bearer {{Token}}
```

## 🔍 Bước 13: Test Health Check

### 13.1 Health check
```
GET http://localhost:5001/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-07T14:25:37.533Z",
  "uptime": 123.456,
  "memory": {
    "rss": 12345678,
    "heapTotal": 12345678,
    "heapUsed": 12345678,
    "external": 12345678
  },
  "environment": {
    "database": "localhost:5432/dating_software",
    "redis": "localhost:6379",
    "frontend": "http://localhost:3000"
  }
}
```

## 🧪 Bước 14: Test Error Handling

### 14.1 Test invalid token
```
GET {{Base URL}}/user/me
Authorization: Bearer invalid_token
```

### 14.2 Test missing required fields
```
POST {{Base URL}}/user/register
Content-Type: application/json

{
  "email": "test@example.com"
  // Missing password
}
```

### 14.3 Test invalid JSON
```
POST {{Base URL}}/user/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  // Invalid JSON syntax
```

## 📊 Bước 15: Test Performance

### 15.1 Test response time
- Sử dụng Postman's "Tests" tab để đo response time
- Expected: < 500ms cho các API đơn giản

### 15.2 Test concurrent requests
- Sử dụng Postman's Runner để test nhiều request cùng lúc
- Expected: Không có lỗi timeout hoặc connection refused

## 🎯 Checklist Test

### ✅ Authentication
- [ ] Register user
- [ ] Login user
- [ ] Invalid credentials
- [ ] Token validation

### ✅ User Management
- [ ] Get current user
- [ ] Update user info
- [ ] Get user by email
- [ ] Delete user

### ✅ Photo Management
- [ ] Upload photo
- [ ] Get user photos
- [ ] Delete photo
- [ ] Invalid file type

### ✅ Profile Management
- [ ] Create profile
- [ ] Get profile
- [ ] Update profile
- [ ] Delete profile

### ✅ Swipe System
- [ ] Swipe right (like)
- [ ] Swipe left (pass)
- [ ] Get swipe history
- [ ] Duplicate swipe

### ✅ Match System
- [ ] Get matches
- [ ] Get match details
- [ ] Delete match

### ✅ Messaging
- [ ] Send message
- [ ] Get messages
- [ ] Mark as read
- [ ] Delete message

### ✅ Settings
- [ ] Create settings
- [ ] Get settings
- [ ] Update settings

### ✅ Subscription
- [ ] Create subscription
- [ ] Get current subscription
- [ ] Cancel subscription

### ✅ Consumables
- [ ] Use super like
- [ ] Use boost
- [ ] Get consumable count

### ✅ File Upload
- [ ] Upload file
- [ ] Get file
- [ ] Delete file

### ✅ Error Handling
- [ ] Invalid token
- [ ] Missing fields
- [ ] Invalid data
- [ ] Server errors

## 🚨 Troubleshooting

### Lỗi thường gặp:

1. **401 Unauthorized**
   - Kiểm tra token có đúng không
   - Token có hết hạn không

2. **400 Bad Request**
   - Kiểm tra format JSON
   - Kiểm tra required fields

3. **404 Not Found**
   - Kiểm tra URL có đúng không
   - Kiểm tra ID có tồn tại không

4. **500 Internal Server Error**
   - Kiểm tra database connection
   - Kiểm tra Redis connection
   - Xem server logs

### Debug Tips:

1. **Sử dụng Postman Console**
   - View > Show Postman Console
   - Xem request/response details

2. **Sử dụng Postman Tests**
   ```javascript
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });
   
   pm.test("Response has success field", function () {
       const response = pm.response.json();
       pm.expect(response).to.have.property('success');
   });
   ```

3. **Sử dụng Environment Variables**
   - Lưu token tự động sau khi login
   - Lưu user ID để sử dụng cho các API khác

## 📝 Ghi chú

- Luôn test với dữ liệu thực tế
- Test cả positive và negative cases
- Ghi lại các bugs để fix
- Test performance với nhiều concurrent requests
- Backup database trước khi test destructive operations

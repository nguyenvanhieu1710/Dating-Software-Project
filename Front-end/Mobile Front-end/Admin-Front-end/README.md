# Dating App Admin Mobile

Ứng dụng mobile quản trị cho nền tảng hẹn hò online, được thiết kế với giao diện hiện đại và màu sắc tím/violet làm chủ đạo.

## Tính năng chính

### 🔐 Đăng nhập & Bảo mật
- **Màn hình đăng nhập Admin**: Form nhập email và mật khẩu
- **Xác thực hai yếu tố (2FA)**: Tăng cường bảo mật cho tài khoản admin
- **Thông báo đẩy**: Nhận thông báo cho các sự kiện quan trọng

### 📊 Dashboard (Tab 1)
- **Thẻ chỉ số**: Doanh thu, người dùng mới, báo cáo đang chờ, người dùng online
- **Biểu đồ đường**: Thống kê doanh thu 7 ngày gần nhất
- **Quick Actions**: Nút truy cập nhanh đến các chức năng chính

### 🛡️ Moderation Queue (Tab 2)
- **Danh sách báo cáo**: Hiển thị các báo cáo đang chờ xử lý
- **Phân loại ưu tiên**: Báo cáo nghiêm trọng được ưu tiên lên đầu
- **Thông tin chi tiết**: Ảnh đại diện, lý do báo cáo, thời gian
- **Màn hình chi tiết báo cáo**: 
  - Thông tin người báo cáo và bị báo cáo
  - Nội dung bị báo cáo (ảnh/chat)
  - Các nút hành động: Bỏ qua, Xóa nội dung, Khóa tài khoản (7 ngày/vĩnh viễn)

### 👥 User Management (Tab 3)
- **Tìm kiếm người dùng**: Theo email hoặc ID
- **Thống kê trạng thái**: Active, Suspended, Banned
- **Màn hình chi tiết người dùng**:
  - Thông tin cơ bản: Tên, Email, Trạng thái
  - Thống kê hoạt động: Profile views, Matches, Reports
  - Các nút hành động: Khóa tài khoản, Xem lịch sử báo cáo, Reset mật khẩu

## Thiết kế giao diện

### Màu sắc chủ đạo
- **Primary**: Violet (#8B5CF6)
- **Secondary**: Light Violet (#A78BFA)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### Phong cách
- Thiết kế hiện đại với card-based layout
- Hỗ trợ Dark/Light mode
- Responsive design cho mobile
- Icon system nhất quán

## Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start

# Chạy trên iOS
npm run ios

# Chạy trên Android
npm run android
```

## Cấu trúc thư mục

```
app/
├── (tabs)/
│   ├── index.tsx          # Dashboard
│   ├── moderation.tsx     # Moderation Queue
│   ├── users.tsx          # User Management
│   └── _layout.tsx        # Tab Layout
├── login.tsx              # Login Screen
├── report-detail.tsx      # Report Detail
├── user-detail.tsx        # User Detail
└── _layout.tsx            # Root Layout
```

## Công nghệ sử dụng

- **React Native** với Expo
- **TypeScript** cho type safety
- **Expo Router** cho navigation
- **React Navigation** cho tab navigation
- **Expo Vector Icons** cho icon system

## Demo

Ứng dụng bao gồm dữ liệu mẫu để demo các tính năng:
- 4 báo cáo mẫu với các mức độ nghiêm trọng khác nhau
- 6 người dùng mẫu với các trạng thái khác nhau
- Thống kê và biểu đồ mẫu trên Dashboard

## Tính năng bảo mật

- Xác thực hai yếu tố (2FA)
- Màn hình đăng nhập riêng biệt cho admin
- Phân quyền truy cập
- Logging các hành động quan trọng

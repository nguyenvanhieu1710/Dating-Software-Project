# Dating Software Project - Phần mềm Hẹn hò Trực tuyến

**Một hệ sinh thái ứng dụng hẹn hò hiện đại, đa nền tảng, lấy cảm hứng từ Tinder, phục vụ cả người dùng và quản trị viên.**

---

## 🏗️ Kiến trúc tổng thể

- **Back-end**: Node.js + Express, RESTful API, quản lý xác thực, người dùng, hồ sơ, vuốt, tương hợp, chat, báo cáo, quản trị, thanh toán, v.v.
- **Mobile Front-end**: React Native + Expo, gồm 2 app:
  - **User App**: Ứng dụng hẹn hò cho người dùng cuối (iOS/Android).
  - **Admin App**: Ứng dụng quản trị dành cho admin (iOS/Android).
- **Website Front-end**: Next.js/React, gồm 2 app:
  - **User Web**: Giao diện web cho người dùng.
  - **Admin Web**: Giao diện web quản trị.
- **Database**: PostgreSQL + PostGIS (hỗ trợ truy vấn vị trí, tối ưu cho app hẹn hò).
- **Diagram**: Sơ đồ ERD, kiến trúc, luồng dữ liệu (file .vpp).

---

## 🎯 Mục tiêu & Đặc điểm nổi bật

- Kết nối, khám phá, trò chuyện, tìm kiếm bạn mới, trải nghiệm vuốt (swipe) hiện đại.
- Quản trị viên kiểm duyệt, thống kê, xử lý báo cáo, quản lý người dùng.
- Hỗ trợ đa nền tảng: mobile (iOS/Android), web.
- Bảo mật, xác thực đa phương thức, phân quyền rõ ràng.
- Tối ưu trải nghiệm người dùng, giao diện đẹp, màu sắc nhận diện riêng (tím/violet).

---

## 🗂️ Cấu trúc thư mục chính

```
.
├── Back-end/                # Node.js API, Express, models, controllers, middlewares
│   └── src/
│       ├── app/
│       │   ├── controllers/
│       │   ├── models/
│       │   └── middlewares/
│       ├── config/
│       ├── routes/
│       └── index.js
├── Front-end/
│   ├── Mobile Front-end/
│   │   ├── User-Front-end/      # App mobile cho người dùng
│   │   └── Admin-Front-end/     # App mobile cho admin
│   └── Website Front-end/
│       ├── User Front-end/      # Web user
│       └── Admin Front-end/     # Web admin
├── Diagram/
│   └── DatingSoftware.vpp       # Sơ đồ ERD, kiến trúc hệ thống
├── DatingSoftware.sql           # Toàn bộ schema database, trigger, index
└── README.md                    # (Bạn đang đọc file này)
```

---

## ⚙️ Công nghệ sử dụng

- **Back-end**: Node.js, Express, PostgreSQL, PostGIS, JWT, Multer, Bcrypt, RESTful API.
- **Mobile/Web Front-end**: React Native (Expo), React, Next.js, TypeScript, Expo Router, React Navigation, Tailwind/TW, Expo Vector Icons.
- **Database**: PostgreSQL, PostGIS (truy vấn vị trí), trigger, index tối ưu.
- **Khác**: Docker (nếu cần), ESLint, Prettier, CI/CD (tùy chọn).

---

## 🧩 Các module & chức năng chính

### 1. **Back-end API**
- Đăng ký, đăng nhập, xác thực OTP, quên mật khẩu.
- Quản lý hồ sơ, ảnh, sở thích, cài đặt tìm kiếm.
- Vuốt (swipe), tương hợp (match), chat, báo cáo, block.
- Quản lý gói trả phí (Plus, Gold, Platinum), thanh toán.
- Quản trị viên: kiểm duyệt, thống kê, xử lý báo cáo, quản lý người dùng.
- API chuẩn RESTful, trả về JSON, bảo mật JWT.

### 2. **Mobile User App**
- Onboarding, đăng ký/đăng nhập đa phương thức.
- Tạo hồ sơ nhiều bước, xin quyền vị trí/thông báo.
- Swipe Deck, Likes You, Messages, Profile, Chat, Match, Paywall, Settings.
- Giao diện hiện đại, màu tím chủ đạo, UX tối ưu mobile.

### 3. **Mobile Admin App**
- Đăng nhập 2FA, dashboard thống kê, kiểm duyệt báo cáo, quản lý người dùng.
- Giao diện tab bar, card-based, thao tác nhanh, bảo mật cao.

### 4. **Website User/Admin**
- Đầy đủ tính năng như mobile, tối ưu cho desktop.
- Quản trị viên có dashboard, kiểm duyệt, thống kê, quản lý tài khoản.

### 5. **Database & Diagram**
- Thiết kế chuẩn hóa, tối ưu cho truy vấn vị trí, nhiều bảng liên kết (users, profiles, photos, swipes, matches, messages, subscriptions, ...).
- Sơ đồ ERD, kiến trúc hệ thống, backup đầy đủ.

---

## 🔗 Luồng chức năng & điều hướng

- **User**: Onboarding → Đăng nhập/Đăng ký → Tạo hồ sơ → Xin quyền → (Discovery, Likes, Messages, Profile, Chat, Match, Paywall, Settings)
- **Admin**: Đăng nhập 2FA → Dashboard → Moderation → Users → Chi tiết báo cáo/người dùng
- **Web**: Tương tự mobile, tối ưu cho desktop/tablet.

---

## 🗄️ Database (PostgreSQL + PostGIS)

- **users**: Thông tin xác thực, trạng thái.
- **profiles**: Hồ sơ chi tiết, vị trí, bio, nghề nghiệp, trường học.
- **photos**: Ảnh đại diện, thứ tự.
- **swipes**: Lịch sử vuốt (like, pass, superlike).
- **matches**: Các cặp đôi đã tương hợp.
- **messages**: Tin nhắn giữa các cặp đôi.
- **subscriptions**: Gói trả phí, trạng thái.
- **settings**: Cài đặt tìm kiếm, hiển thị.
- **interests**: Sở thích, liên kết profile.
- **Bảng báo cáo, block, ...** (nếu có).

---

## 🛠️ Hướng dẫn cài đặt & chạy

### 1. **Back-end**
```bash
cd Back-end
npm install
npm start
# Cấu hình .env theo env.example
```

### 2. **Mobile Front-end (User/Admin)**
```bash
cd Front-end/Mobile Front-end/User-Front-end
npm install
npm start
# Tương tự cho Admin-Front-end
```

### 3. **Website Front-end (User/Admin)**
```bash
cd Front-end/Website Front-end/User Front-end
npm install
npm run dev
# Tương tự cho Admin Front-end
```

### 4. **Database**
- Import file `DatingSoftware.sql` vào PostgreSQL.
- Cài extension PostGIS nếu cần.

---

## 📊 Sơ đồ & tài liệu

- **Diagram/DatingSoftware.vpp**: Sơ đồ ERD, kiến trúc hệ thống, luồng dữ liệu.
- **10122169_NguyenVanHieu_DatingSoftwareReport.doc**: Báo cáo chi tiết (mục tiêu, phân tích, thiết kế, triển khai, demo).

---

## 📦 Scripts hữu ích

- `npm run lint` — Kiểm tra code style
- `npm run reset-project` — Reset lại thư mục app (mobile)
- `npm run dev` — Chạy web front-end

---

## 📄 License & Đóng góp

- Dự án phục vụ học tập, nghiên cứu, demo UI/UX, có thể mở rộng cho sản phẩm thực tế.
- Bạn có thể fork, đóng góp, hoặc sử dụng lại cho các dự án cá nhân.

---

## 👤 Tác giả

- **Nguyễn Văn Hiếu**
- Email: nguyenvanhieu171004@gmail.com
- Vai trò: Thiết kế, phát triển, triển khai toàn bộ hệ thống phần mềm hẹn hò trực tuyến (Fullstack Developer)
- Báo cáo chi tiết: `10122169_NguyenVanHieu_DatingSoftwareReport.doc`

**Dating Software Project - Kết nối, Khám phá, Trò chuyện, An toàn & Hiện đại!**

# Dating Software Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue)](https://reactnative.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

**A modern, cross-platform dating application ecosystem inspired by Tinder, serving both end-users and administrators with a complete set of features for online dating and user management.**

## 🌟 Key Features

- **User Authentication**: Secure login with JWT, OTP verification, and social login
- **Profile Management**: Complete user profiles with photos, bio, and preferences
- **Matching System**: Advanced swiping interface with smart matching algorithm
- **Real-time Chat**: Instant messaging between matched users
- **Location-based Discovery**: Find matches nearby using geolocation
- **Admin Dashboard**: Comprehensive admin panel for user and content management
- **Subscription System**: Multiple premium membership tiers with exclusive features
- **Reporting System**: User reporting and content moderation tools
- **Multi-platform Support**: Native mobile apps (iOS/Android) and responsive web interface

---

## 🏗️ System Architecture

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **API**: RESTful API with JWT authentication
- **Database**: PostgreSQL 15+ with PostGIS extension
- **File Storage**: Local file system with Multer middleware
- **API Documentation**: Postman Collection included

### Mobile Applications (React Native)
- **User App**: Dating application for end-users (iOS/Android)
  - Built with React Native and Expo
  - Expo Router for navigation
  - Redux for state management
  - Real-time updates with WebSockets

- **Admin App**: Management application for administrators
  - User management
  - Content moderation
  - Analytics dashboard
  - Report handling

### Web Applications (Next.js)
- **User Web Portal**: Responsive web interface for users
  - Server-side rendering with Next.js
  - Responsive design with Tailwind CSS
  - PWA support

- **Admin Dashboard**: Comprehensive admin interface
  - User management
  - Content moderation
  - Analytics and reporting
  - System configuration

### Database
- **PostgreSQL 15+** with PostGIS extension for geospatial queries
- **Database Schema**: Well-normalized design with proper indexes
- **Migrations**: SQL-based migration system
- **Backup**: Automated backup procedures

---

## 🚀 Features

### User Features
- **Profile Creation**: Detailed user profiles with photos and preferences
- **Smart Matching**: Advanced algorithm for suggesting compatible matches
- **Swipe Interface**: Intuitive card-based interface for discovering potential matches
- **Real-time Messaging**: Instant chat with matched users
- **Location-based Discovery**: Find matches based on proximity
- **Advanced Filters**: Filter matches by age, distance, interests, and more
- **Likes & Super Likes**: Express interest in potential matches
- **Moments**: Share updates and photos with your matches
- **Privacy Controls**: Manage who can see your profile and contact you
- **Report & Block**: Report inappropriate behavior and block users

### Admin Features
- **User Management**: View, edit, and manage user accounts
- **Content Moderation**: Review and moderate user-generated content
- **Analytics Dashboard**: Monitor platform usage and growth metrics
- **Report Management**: Handle user reports and take appropriate actions
- **System Configuration**: Configure platform settings and features
- **Subscription Management**: Manage premium subscriptions and payments

### Technical Highlights
- **Cross-platform**: Native mobile apps and responsive web interface
- **Scalable Architecture**: Designed to handle growing user base
- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Real-time Updates**: WebSockets for instant messaging and notifications
- **Performance Optimized**: Efficient database queries and caching
- **CI/CD Ready**: Set up for continuous integration and deployment

---

## 📁 Project Structure

```
.
├── Back-end/                    # Backend API Server
│   ├── src/                    
│   │   ├── app/                # Application core
│   │   │   ├── controllers/    # Request handlers
│   │   │   ├── models/         # Database models
│   │   │   ├── middlewares/    # Express middlewares
│   │   │   └── services/       # Business logic
│   │   ├── config/             # Configuration files
│   │   ├── routes/             # API route definitions
│   │   ├── uploads/            # File uploads directory
│   │   └── index.js            # Application entry point
│   ├── .env                    # Environment variables
│   └── package.json            # Dependencies and scripts
│
├── Front-end/
│   ├── Mobile Front-end/       
│   │   ├── User-Front-end/     # Mobile app for end-users
│   │   └── Admin-Front-end/    # Mobile admin app
│   └── Website Front-end/
│       ├── User Front-end/     # Web portal for users
│       └── Admin Front-end/    # Web admin dashboard
│
├── Diagram/                    # System diagrams and documentation
│   ├── ERD.vpp                # Entity Relationship Diagram
│   ├── Architecture.vpp       # System architecture
│   └── Workflow.vpp           # User workflow diagrams
│
├── Documentation/              # Project documentation
│   ├── API/                   # API documentation
│   ├── Database/              # Database schema and migrations
│   └── Deployment/            # Deployment guides
│
├── DatingSoftware.sql          # Database schema and seed data
├── .gitignore                 # Git ignore file
└── README.md                  # Project documentation (this file)
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **API**: RESTful API
- **Authentication**: JWT, OAuth 2.0
- **Database**: PostgreSQL 15+ with PostGIS
- **File Upload**: Multer
- **Validation**: Joi
- **Testing**: Jest, Supertest
- **Documentation**: Postman Collection

### Frontend (Mobile & Web)
- **Mobile Framework**: React Native with Expo
- **Web Framework**: Next.js 13+
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS, Styled Components
- **Navigation**: React Navigation (Mobile), Next.js Router (Web)
- **UI Components**: React Native Paper, React Native Elements
- **Forms**: Formik with Yup validation
- **Real-time**: Socket.IO
- **Maps**: React Native Maps, Mapbox

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm / Yarn
- **Code Formatting**: Prettier
- **Linting**: ESLint
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry
- **Analytics**: Google Analytics, Firebase Analytics

---

## 🏗️ System Components

### 1. Authentication & Authorization
- User registration and login (email/password, social login)
- Email verification (OTP)
- Password reset flow
- Role-based access control (User, Admin, Moderator)
- Session management with JWT
- Two-factor authentication (2FA) for admin accounts

### 2. User Profile Management
- Profile creation and editing
- Photo upload and management
- Personal information and preferences
- Discovery settings (distance, age range, etc.)
- Verification system (email, phone, photo verification)

### 3. Matching System
- Swipe-based matching interface
- Smart algorithm for match suggestions
- Like/Pass/Super Like functionality
- Mutual matching notifications
- Match quality scoring

### 4. Messaging System
- Real-time chat between matched users
- Read receipts and typing indicators
- Media sharing (images, locations)
- Message search and filtering
- Message requests for non-matched users (premium feature)

### 5. Discovery & Search
- Location-based user discovery
- Advanced search filters
- Daily recommended profiles
- Incognito mode (premium feature)
- Boost profile visibility (premium feature)

### 6. Admin Dashboard
- User management (view, edit, ban users)
- Content moderation
- Report handling
- Analytics and metrics
- System configuration
- Payment and subscription management

### 7. Subscription & Payments
- Multiple subscription tiers
- In-app purchases
- Payment gateway integration
- Subscription management
- Promo codes and discounts

### 8. Security & Privacy
- End-to-end encryption for messages
- Photo verification
- Block and report users
- Data export and account deletion
- Privacy settings and controls

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or Yarn
- PostgreSQL 15+
- Redis (for caching and real-time features)
- Expo CLI (for mobile development)

### Installation

#### Backend Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   cd Back-end
   npm install
   ```
3. Set up environment variables (copy .env.example to .env)
4. Start the development server:
   ```bash
   npm run dev
   ```

#### Mobile App Setup
1. Navigate to the mobile app directory:
   ```bash
   cd Front-end/Mobile\ Front-end/User-Front-end
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   expo start
   ```

#### Web App Setup
1. Navigate to the web app directory:
   ```bash
   cd Front-end/Website\ Front-end/User\ Front-end
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📚 Documentation

- [API Documentation](Documentation/API/README.md)
- [Database Schema](Documentation/Database/SCHEMA.md)
- [Deployment Guide](Documentation/Deployment/README.md)
- [Mobile App Development](Documentation/Mobile/README.md)
- [Web App Development](Documentation/Web/README.md)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For any questions or inquiries, please contact [contact.hieunguyen.work@gmail.com] or open an issue in the repository.

## 🙏 Acknowledgments

- [React Native](https://reactnative.dev/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Expo](https://expo.io/)
- [Next.js](https://nextjs.org/)

---

## 🗄️ Database (PostgreSQL + PostGIS)

- **users**: Authentication and status information
- **profiles**: Detailed profiles, location, bio, occupation, education
- **photos**: Profile pictures and their order
- **swipes**: Swipe history (like, pass, superlike)
- **matches**: Matched user pairs
- **messages**: Chat messages between matched users
- **subscriptions**: Subscription plans and status
- **settings**: Search and display preferences
- **interests**: User interests, linked to profiles
- **Additional tables**: Reports, blocks, and other supporting tables

---

## 📊 Diagrams & Documentation

- **Diagram/DatingSoftware.vpp**: ERD, system architecture, data flow diagrams
- **10122169_NguyenVanHieu_DatingSoftwareReport.doc**: Detailed report (objectives, analysis, design, implementation, demo)

---

## 📦 Useful Scripts

- `npm run lint` — Check code style
- `npm run reset-project` — Reset app directory (mobile)
- `npm run dev` — Start web front-end

---

## 👤 Author

- **Nguyen Van Hieu**
- Email: contact.hieunguyen.work@gmail.com
- Role: Fullstack Developer - Design, development, and deployment of the entire online dating software system
- Detailed Report: `10122169_NguyenVanHieu_DatingSoftwareReport.doc`

**Dating Software Project - Connect, Discover, Chat, Safe & Modern!**

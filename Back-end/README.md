# Dating Software Backend API

A comprehensive REST API for a dating application built with Node.js, Express, and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with registration, login, and password management
- **Profile Management**: Complete user profiles with photos, bio, and location
- **Swipe System**: Like, pass, and super like functionality
- **Matching Algorithm**: Mutual matching system
- **Messaging**: Real-time chat between matched users
- **Photo Management**: Upload, organize, and manage user photos
- **Settings & Preferences**: User preferences for age, distance, and gender
- **Subscription System**: Premium features and subscription management
- **Consumables**: Super likes and boosts management
- **Geolocation**: Location-based matching using PostGIS
- **Statistics**: Comprehensive analytics and reporting

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **PostGIS** - Geographic database extension
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling

## Project Structure

```
src/
├── app/
│   ├── controllers/     # Business logic
│   ├── models/         # Database models
│   └── middlewares/    # Custom middlewares
├── config/
│   └── database/       # Database configuration
├── routes/             # API routes
└── index.js           # Server entry point
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Back-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=12345678
   DB_NAME=dating_software
   DB_PORT=5432
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

4. **Set up PostgreSQL database**
   ```sql
   -- Create database
   CREATE DATABASE dating_software;
   
   -- Run the schema script
   psql -d dating_software -f DatingSoftware.sql
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`

## API Documentation

Complete API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Quick Start Guide

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "phone_number": "+1234567890"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Create Profile
```bash
curl -X POST http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": 1,
    "first_name": "John",
    "dob": "1990-01-01",
    "gender": "male",
    "bio": "I love hiking and coffee",
    "longitude": -74.006,
    "latitude": 40.7128
  }'
```

### 4. Add Photos
```bash
curl -X POST http://localhost:5000/api/photo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": 1,
    "url": "https://example.com/photo.jpg",
    "order_index": 0
  }'
```

### 5. Set Preferences
```bash
curl -X POST http://localhost:5000/api/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": 1,
    "preferred_gender": "female",
    "min_age": 18,
    "max_age": 30,
    "max_distance_km": 50,
    "is_discoverable": true
  }'
```

### 6. Start Swiping
```bash
curl -X POST http://localhost:5000/api/swipe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "swiper_user_id": 1,
    "swiped_user_id": 2,
    "action": "like"
  }'
```

## Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- **users** - User accounts and authentication
- **profiles** - User profile information with geolocation
- **photos** - User photos with ordering
- **swipes** - Swipe actions (like, pass, superlike)
- **matches** - Mutual matches between users
- **messages** - Chat messages between matched users
- **settings** - User preferences and search criteria
- **subscriptions** - Premium subscription management
- **consumables** - Super likes and boosts inventory

## Key Features

### Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Account verification system
- Password reset functionality

### Profile System
- Complete user profiles with bio, job, education
- Photo management with ordering
- Location-based matching using PostGIS
- Popularity scoring algorithm

### Swipe & Matching
- Like, pass, and super like actions
- Mutual matching detection
- Potential matches discovery
- Swipe statistics and analytics

### Messaging
- Real-time chat between matched users
- Message read status tracking
- Message search functionality

### Premium Features
- Subscription management (Plus, Gold, Platinum)
- Super likes with daily limits
- Boost functionality for increased visibility
- Consumable inventory management

### Settings & Preferences
- Age range preferences
- Distance-based filtering
- Gender preferences
- Discoverable status control

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Database Migrations
The database schema is defined in `DatingSoftware.sql`. To apply changes:

```bash
psql -d dating_software -f DatingSoftware.sql
```

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=dating_software
DB_PORT=5432
JWT_SECRET=your-production-secret-key
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start src/index.js --name "dating-api"
pm2 save
pm2 startup
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please refer to the API documentation or create an issue in the repository. 
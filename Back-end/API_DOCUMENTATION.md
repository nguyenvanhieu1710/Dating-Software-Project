# Dating Software API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /api/user/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "phone_number": "+1234567890"
}
```

**Required Fields:**
- `email` (string): User's email address
- `password` (string): User's password (will be hashed)
- `phone_number` (string): User's phone number with country code

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "phone_number": "+1234567890",
      "status": "unverified"
    },
    "token": "jwt_token_here"
  },
  "message": "Registration successful"
}
```

#### POST /api/user/login
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### PUT /api/user/:userId/verify
Verify user account
```
No body required
```

#### PUT /api/user/:userId/change-password
Change user password
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

#### POST /api/user/reset-password
Request password reset
```json
{
  "email": "user@example.com"
}
```

### User Management

#### GET /api/user
Get all users (Admin only)

#### GET /api/user/:id
Get user by ID

#### POST /api/user
Create new user

#### PUT /api/user/:id
Update user

#### DELETE /api/user/:id
Delete user

#### GET /api/user/with-profiles
Get all users with profiles

#### GET /api/user/email/:email
Get user by email

#### POST /api/user/with-profile
Create user with profile

### Profile Management

#### GET /api/profile/user/:userId
Get user profile with photos

#### POST /api/profile
Create new profile
```json
{
  "user_id": 1,
  "first_name": "John",
  "dob": "1990-01-01",
  "gender": "male",
  "bio": "I love hiking and coffee",
  "job_title": "Software Engineer",
  "school": "MIT",
  "longitude": -74.006,
  "latitude": 40.7128
}
```

#### PUT /api/profile/user/:userId
Update profile

#### GET /api/profile/search
Search profiles with filters
```
?minAge=18&maxAge=30&gender=female&maxDistance=50&latitude=40.7128&longitude=-74.006
```

#### PUT /api/profile/user/:userId/last-active
Update last active time

#### PUT /api/profile/user/:userId/popularity
Calculate popularity score

#### GET /api/profile/user/:userId/potential-matches
Get potential matches for user

### Swipe Management

#### POST /api/swipe
Perform swipe action
```json
{
  "swiper_user_id": 1,
  "swiped_user_id": 2,
  "action": "like" // "like", "pass", "superlike"
}
```

#### GET /api/swipe/user/:userId/swiped
Get users that the current user has swiped

#### GET /api/swipe/user/:userId/swiped-by
Get users who have swiped the current user

#### GET /api/swipe/user/:userId/stats
Get swipe statistics

#### DELETE /api/swipe/:swiperUserId/:swipedUserId
Undo swipe

#### GET /api/swipe/user/:userId/potential-matches
Get potential matches for swiping

### Match Management

#### GET /api/match/user/:userId
Get all matches for user

#### GET /api/match/:matchId/user/:userId
Get specific match details

#### PUT /api/match/:matchId/user/:userId/unmatch
Unmatch with user

#### GET /api/match/user/:userId/stats
Get match statistics

#### GET /api/match/mutual/:user1Id/:user2Id
Check mutual match status

### Messaging

#### GET /api/match/:matchId/user/:userId/messages
Get messages for a match
```
?limit=50&offset=0
```

#### POST /api/match/:matchId/user/:userId/messages
Send message
```json
{
  "content": "Hello! How are you?"
}
```

#### PUT /api/match/:matchId/user/:userId/messages/read
Mark messages as read

### Photo Management

#### GET /api/photo/user/:userId
Get all photos for user

#### POST /api/photo
Add single photo
```json
{
  "user_id": 1,
  "url": "https://example.com/photo.jpg",
  "order_index": 0
}
```

#### POST /api/photo/multiple
Upload multiple photos
```json
{
  "user_id": 1,
  "photos": [
    {
      "url": "https://example.com/photo1.jpg",
      "order_index": 0
    },
    {
      "url": "https://example.com/photo2.jpg",
      "order_index": 1
    }
  ]
}
```

#### PUT /api/photo/:photoId/order
Update photo order
```json
{
  "order_index": 2
}
```

#### DELETE /api/photo/:photoId/user/:userId
Delete photo

#### GET /api/photo/user/:userId/count
Get photo count

#### GET /api/photo/user/:userId/primary
Get primary photo

### Settings Management

#### GET /api/settings/user/:userId
Get user settings

#### POST /api/settings
Create settings
```json
{
  "user_id": 1,
  "preferred_gender": "female",
  "min_age": 18,
  "max_age": 30,
  "max_distance_km": 50,
  "is_discoverable": true
}
```

#### PUT /api/settings/user/:userId
Update settings

#### PUT /api/settings/user/:userId/upsert
Create or update settings

#### PUT /api/settings/user/:userId/discoverable
Update discoverable status
```json
{
  "is_discoverable": false
}
```

#### PUT /api/settings/user/:userId/distance
Update search distance
```json
{
  "max_distance_km": 25
}
```

#### PUT /api/settings/user/:userId/age-range
Update age range
```json
{
  "min_age": 20,
  "max_age": 35
}
```

#### PUT /api/settings/user/:userId/preferred-gender
Update preferred gender
```json
{
  "preferred_gender": "all"
}
```

### Subscription Management

#### GET /api/subscription/user/:userId/current
Get current subscription

#### GET /api/subscription/user/:userId
Get all subscriptions for user

#### POST /api/subscription
Create subscription
```json
{
  "user_id": 1,
  "plan_type": "plus",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-02-01T00:00:00Z",
  "payment_gateway_transaction_id": "txn_123"
}
```

#### PUT /api/subscription/:subscriptionId/status
Update subscription status
```json
{
  "status": "cancelled"
}
```

#### PUT /api/subscription/:subscriptionId/user/:userId/cancel
Cancel subscription

#### GET /api/subscription/user/:userId/check
Check if user has active subscription

#### GET /api/subscription/stats
Get subscription statistics

#### GET /api/subscription/expiring
Get expiring subscriptions
```
?days=7
```

#### PUT /api/subscription/:subscriptionId/renew
Renew subscription
```json
{
  "end_date": "2024-03-01T00:00:00Z"
}
```

### Consumable Management

#### GET /api/consumable/user/:userId
Get user consumables

#### PUT /api/consumable/user/:userId
Update consumables
```json
{
  "super_likes_balance": 5,
  "boosts_balance": 3
}
```

#### PUT /api/consumable/user/:userId/super-like/use
Use super like

#### PUT /api/consumable/user/:userId/super-like/add
Add super likes
```json
{
  "amount": 5
}
```

#### GET /api/consumable/user/:userId/super-like/can-use
Check if can use super like

#### PUT /api/consumable/user/:userId/super-like/reset
Reset daily super likes

#### PUT /api/consumable/user/:userId/boost/use
Use boost

#### PUT /api/consumable/user/:userId/boost/add
Add boosts
```json
{
  "amount": 3
}
```

#### GET /api/consumable/user/:userId/boost/can-use
Check if can use boost

#### GET /api/consumable/stats
Get consumable statistics

### File Upload

#### POST /api/upload
Upload file
```
Content-Type: multipart/form-data
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Stack trace (development only)"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Environment Variables

Create a `.env` file with:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=12345678
DB_NAME=dating_software
DB_PORT=5432
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Database Setup

1. Create PostgreSQL database
2. Run the `DatingSoftware.sql` script to create tables
3. Install dependencies: `npm install`
4. Start server: `npm start`

## Testing

Use tools like Postman or curl to test the API endpoints. Remember to:

1. Register a user first
2. Use the returned JWT token in Authorization header
3. Create a profile for the user
4. Add photos to the profile
5. Set up user preferences
6. Start swiping and matching! 
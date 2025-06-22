# NextAuth.js Authentication Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string_here

# NextAuth Secret (generate a strong random string)
NEXTAUTH_SECRET=your_super_secret_nextauth_key_here
NEXTAUTH_URL=http://localhost:3000

# Firebase Configuration (if using Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## NextAuth Secret Generation

Generate a strong NextAuth secret using one of these methods:

### Method 1: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Method 2: Using OpenSSL
```bash
openssl rand -hex 64
```

## Features Added

1. **Registration Page** (`/register`) - Create admin accounts with email and password
2. **Login Page** (`/login`) - Authenticate admin users using NextAuth
3. **Server-Side Protection** - Protects `/admin` routes with NextAuth session verification
4. **Logout Functionality** - Secure logout using NextAuth signOut
5. **Password Hashing** - Uses bcryptjs for secure password storage
6. **Session Management** - NextAuth handles all session management securely

## API Endpoints

- `POST /api/register` - Register new admin user
- `POST /api/auth/signin` - NextAuth signin endpoint
- `POST /api/auth/signout` - NextAuth signout endpoint
- `GET /api/auth/session` - Get current session

## Security Features

- Password hashing with bcryptjs (12 salt rounds)
- NextAuth JWT sessions with 24-hour expiration
- HTTP-only cookies for session storage
- Email format validation
- Password strength requirements (minimum 6 characters)
- Duplicate email prevention
- Role-based access control (admin role required)
- Server-side session verification
- Automatic session refresh

## Usage

1. Start by registering an admin account at `/register`
2. Login with your credentials at `/login`
3. Access the admin dashboard at `/admin`
4. Use the logout button to securely end your session

## Database Schema

The system creates a `users` collection in MongoDB with the following structure:

```javascript
{
  _id: ObjectId,
  email: String (lowercase, unique),
  password: String (hashed),
  role: String (default: 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

## NextAuth Configuration

The NextAuth configuration includes:
- Credentials provider for email/password authentication
- JWT session strategy with 24-hour max age
- Custom callbacks to include user role in session
- Custom pages for signin and error handling
- Secure session management with HTTP-only cookies

## Benefits of NextAuth.js

- **Built-in Security**: Handles CSRF protection, session management, and secure cookies
- **TypeScript Support**: Full TypeScript support with type safety
- **Session Management**: Automatic session refresh and secure storage
- **Provider Flexibility**: Easy to add other providers (Google, GitHub, etc.) later
- **Production Ready**: Battle-tested authentication solution
- **Zero Configuration**: Minimal setup required for basic authentication 
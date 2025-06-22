# Environment Variables Setup

To fix the deployment issues, you need to set up the following environment variables in your Vercel deployment:

## Required Environment Variables

### 1. NEXTAUTH_SECRET
A secure random string used to encrypt NextAuth.js sessions and tokens.

**How to generate:**
```bash
openssl rand -base64 32
```

**Example:** `your-secret-key-here`

### 2. MONGODB_URI
Your MongoDB connection string.

**Format:** `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### 3. Firebase Configuration (Optional - for image uploads)
If you want to use Firebase Storage for image uploads, add these variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Your Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your Firebase app ID |

**Note:** If Firebase is not configured, the app will still work but image uploads will be disabled.

## Setting up in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXTAUTH_SECRET` | Your generated secret | Production, Preview, Development |
| `MONGODB_URI` | Your MongoDB connection string | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your Firebase auth domain | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase project ID | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Your Firebase storage bucket | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase messaging sender ID | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your Firebase app ID | Production, Preview, Development |

## Local Development

Create a `.env.local` file in your project root:

```env
NEXTAUTH_SECRET=your-secret-key-here
MONGODB_URI=your-mongodb-connection-string
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## After Setting Environment Variables

1. Redeploy your application in Vercel
2. The API endpoints should now work correctly
3. NextAuth.js authentication should function properly
4. Firebase image uploads will work if configured

## Troubleshooting

- If you still get 500 errors, check the Vercel function logs
- Ensure your MongoDB cluster is accessible from Vercel's servers
- Verify that your MongoDB user has the correct permissions
- If Firebase is not configured, image uploads will be disabled but the app will still function
- Check that all Firebase environment variables are set correctly if you want image upload functionality 
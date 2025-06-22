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

## Setting up in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXTAUTH_SECRET` | Your generated secret | Production, Preview, Development |
| `MONGODB_URI` | Your MongoDB connection string | Production, Preview, Development |

## Local Development

Create a `.env.local` file in your project root:

```env
NEXTAUTH_SECRET=your-secret-key-here
MONGODB_URI=your-mongodb-connection-string
```

## After Setting Environment Variables

1. Redeploy your application in Vercel
2. The API endpoints should now work correctly
3. NextAuth.js authentication should function properly

## Troubleshooting

- If you still get 500 errors, check the Vercel function logs
- Ensure your MongoDB cluster is accessible from Vercel's servers
- Verify that your MongoDB user has the correct permissions 
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectMongo } from '@/db/mongodb';

// Check for required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('NEXTAUTH_SECRET is not defined in environment variables');
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if MongoDB URI is available
        if (!process.env.MONGODB_URI) {
          console.error('MONGODB_URI not available for authentication');
          return null;
        }

        try {
          const client = await connectMongo();
          const db = client.db();

          // Find user by email
          const user = await db.collection('users').findOne({ 
            email: credentials.email.toLowerCase() 
          });

          if (!user) {
            await client.close();
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            await client.close();
            return null;
          }

          await client.close();

          // Return user object (password will be excluded)
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.email // Using email as name for display
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user role to token
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user role to session
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  debug: process.env.NODE_ENV === 'development',
}); 
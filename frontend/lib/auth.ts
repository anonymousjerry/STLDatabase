import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "reCAPTCHA Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
              recaptchaToken: credentials?.recaptchaToken,
            }),
          });
          const user = await res.json();
          if (res.ok && user) return user;
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Sync user to your backend/database
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              picture: user.image,
              sub: profile?.sub
            }),
          });
          
          if (response.ok) {
            const userData = await response.json();
            console.log('Google auth backend response:', userData);
            
            (user as any).id = userData.user.id;
            (user as any).role = userData.user.role;
            (user as any).username = userData.user.username || user.name; // Set username from backend, fallback to Google name
            
            console.log('User object after Google auth:', {
              id: (user as any).id,
              email: user.email,
              name: user.name,
              username: (user as any).username,
              role: (user as any).role
            });
            
            return true;
          }
        } catch (error) {
          console.error("Google auth sync error:", error);
        }
      }
      return true;
    },

    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          username: (user as any).username || user.name, // Use username if available, fallback to name
          image: user.image,
          role: (user as any).role || 'user'
        };
      }
      
      // Ensure Google user data is preserved in token
      if (account?.provider === "google" && user) {
        token.provider = "google";
        // Make sure username is set from Google profile
        if (!token.user.username && user.name) {
          token.user.username = user.name;
        }
        console.log('JWT token for Google user:', {
          provider: token.provider,
          user: token.user
        });
      }
      
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (token.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.provider = token.provider;
        
        // Debug logging for Google users
        if (token.provider === "google") {
          console.log('Session created for Google user:', {
            user: session.user,
            provider: session.provider
          });
        }
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === 'development',
};

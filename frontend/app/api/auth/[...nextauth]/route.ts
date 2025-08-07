import NextAuth from "next-auth";
import {User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { syncUserToSanity } from "@/lib/sanity/user";

export const authOptions: any = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
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
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),

    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }: {token:any, user:any}) {
      if (user?.email) {
      const sanityUser = await syncUserToSanity({
        name: user.name,
        email: user.email
      })

      token.sanityId = sanityUser._id
      token.user = {
        ...user,
        role: sanityUser.role,
        sanityId: sanityUser._id
      }
    }
      return token;
    },
    async session({ session, token }: {session:any, token:any}) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

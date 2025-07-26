import NextAuth from "next-auth";
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id?: string | null;
      username?: string | null;
      email?: string | null;
    };
  }

  interface User {
    accessToken?: string;
  }
}
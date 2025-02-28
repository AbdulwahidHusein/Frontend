import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import signinUser from "./signinUser";
import { Profile } from "@/types/types";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      accessToken: string;
      refreshToken: string;
      profile: Profile | {};
    };
  }
  
  interface User {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    profile: Profile | {};
  }
}

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials) {
            return null;
          }
          const user = await signinUser(
            credentials.email,
            credentials.password
          );
          if (user) {
            return {
              id: user.id,
              email: credentials.email,
              accessToken: user.access,
              refreshToken: user.refresh,
              profile: user.profile,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.profile = user.profile;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        profile: token.profile ?? {},
        email: token.email ?? "",
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

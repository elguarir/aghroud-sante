import type { NextAuthConfig, User } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl, url } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
    session: async ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.email = token.email!;
        session.user.image = token.picture;
        session.user.name = token.name;
      }
      return session;
    },
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === "update" && session?.user) {
        return {
          picture: session.user.image,
          name: session.user.name,
          email: token.email,
          exp: token.exp,
          iat: token.iat,
          sub: token.sub,
          jti: token.jti,
        };
      }

      if (user) {
        return {
          ...token,
          ...user,
        };
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 2, // 2 hours
  },
  providers: [],
} satisfies NextAuthConfig;

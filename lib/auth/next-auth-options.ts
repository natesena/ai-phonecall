import { NextAuthOptions } from "next-auth";
import { LoginCredential } from "./login-credential";

export const nextAuthOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [LoginCredential],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === "update") return { ...token, ...session.user };
      return { ...token, ...user };
    },
    session: async ({ session, token }) => {
      session.user = token as any;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

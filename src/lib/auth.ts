import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
          searchStatus: user.searchStatus,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.subscriptionTier = user.subscriptionTier ?? "FREE";
        token.searchStatus = user.searchStatus ?? "SEARCHING";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = (token.role ?? "STUDENT") as "STUDENT" | "RECRUTEUR" | "ADMIN";
        session.user.id = token.id ?? "";
        session.user.subscriptionTier = (token.subscriptionTier ?? "FREE") as "FREE" | "PRO" | "PREMIUM";
        session.user.searchStatus = (token.searchStatus ?? "SEARCHING") as "SEARCHING" | "IN_ALTERNANCE" | "GRADUATED";
      }
      return session;
    },
  },
};

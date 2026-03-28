import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "RECRUTEUR" | "ADMIN";
      subscriptionTier: "FREE" | "PRO" | "PREMIUM";
      searchStatus: "SEARCHING" | "IN_ALTERNANCE" | "GRADUATED";
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    subscriptionTier?: string;
    searchStatus?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string;
    id?: string;
    subscriptionTier?: string;
    searchStatus?: string;
  }
}

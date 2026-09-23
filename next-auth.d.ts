import { DefaultSession } from "next-auth";

// Two Credentials providers share this app (admin, customer); role
// distinguishes which one authenticated a session.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "customer";
    } & DefaultSession["user"];
  }

  interface User {
    role: "admin" | "customer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "customer";
  }
}

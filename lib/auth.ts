import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "../auth.config";
import { prisma } from "./prisma";

const result = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const admin = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (!admin) return null;

        const isValid = await bcrypt.compare(password, admin.passwordHash);

        if (!isValid) return null;

        return { id: admin.id, email: admin.email, role: "admin" };
      },
    }),
    Credentials({
      id: "customer",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const customer = await prisma.customer.findUnique({
          where: { email },
        });

        if (!customer) return null;

        const isValid = await bcrypt.compare(password, customer.passwordHash);

        if (!isValid) return null;

        return {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          role: "customer",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
});

export const handlers = result.handlers;
export const signIn = result.signIn;
export const signOut = result.signOut;
export const auth = result.auth;
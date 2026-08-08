import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
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

        // Database se admin dhoondo
        const admin = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (!admin) return null;

        // Password compare karo (hash ke saath)
        const isValid = await bcrypt.compare(password, admin.passwordHash);

        if (!isValid) return null;

        // Sab sahi — is admin ko login karne do
        return { id: admin.id, email: admin.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
});
import type { NextAuthConfig } from "next-auth";

// Shared between proxy.ts (edge) and lib/auth.ts (Node, with providers) — keep
// this free of bcrypt/Prisma so it stays edge-compatible.
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isAdmin = auth?.user?.role === "admin";
      const isOnAdmin = request.nextUrl.pathname.startsWith("/admin");
      const isOnLogin = request.nextUrl.pathname === "/admin/login";

      // A customer session is "logged in" too, so this checks role, not just
      // presence of a session — otherwise a customer could reach /admin/*.
      if (isOnAdmin && !isOnLogin && !isAdmin) {
        return false;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "admin" | "customer";
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  providers: [],
};
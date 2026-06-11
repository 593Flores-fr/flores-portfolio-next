import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
      ? [Discord({ clientId: process.env.DISCORD_CLIENT_ID, clientSecret: process.env.DISCORD_CLIENT_SECRET })]
      : []),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.password) return null;
        const valid = await compare(credentials.password as string, user.password);
        if (!valid) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
  events: {
    async signIn({ user, account }) {
      try {
        await prisma.loginEvent.create({
          data: {
            userId: user.id ?? null,
            userEmail: user.email ?? null,
            provider: account?.provider ?? "credentials",
          },
        });
      } catch {}
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "discord") {
          const isAdminDiscord = account.providerAccountId === process.env.ADMIN_DISCORD_ID;

          if (isAdminDiscord) {
            // Compte Discord admin → résoudre vers le compte admin par email
            let dbUser = await prisma.user.findUnique({ where: { email: process.env.ADMIN_EMAIL! } });
            if (!dbUser) {
              dbUser = await prisma.user.create({
                data: { email: process.env.ADMIN_EMAIL!, name: user.name ?? null, image: user.image ?? null },
              });
            } else if (user.image && !dbUser.image) {
              await prisma.user.update({ where: { id: dbUser.id }, data: { image: user.image } });
            }
            token.id = dbUser.id;
            token.email = process.env.ADMIN_EMAIL;
          } else if (user.email) {
            // Compte Discord normal → lier par email
            let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
            if (!dbUser) {
              dbUser = await prisma.user.create({
                data: { email: user.email, name: user.name ?? null, image: user.image ?? null },
              });
            } else if (user.image && !dbUser.image) {
              await prisma.user.update({ where: { id: dbUser.id }, data: { image: user.image } });
            }
            token.id = dbUser.id;
          }
        } else {
          token.id = user.id;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id as string;
      if (token.email) session.user.email = token.email as string;
      return session;
    },
  },
});

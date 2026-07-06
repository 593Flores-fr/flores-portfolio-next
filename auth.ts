import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
      ? [Discord({ clientId: process.env.DISCORD_CLIENT_ID, clientSecret: process.env.DISCORD_CLIENT_SECRET })]
      : []),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "text" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase();
        const ip = getClientIp(request);
        const [ipOk, emailOk] = await Promise.all([
          checkRateLimit(`login-ip:${ip}`, 20, 15 * 60 * 1000),
          checkRateLimit(`login-email:${email}`, 10, 15 * 60 * 1000),
        ]);
        if (!ipOk || !emailOk) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user || !user.password) return null;
        const valid = await compare(credentials.password as string, user.password);
        if (!valid) return null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { id: user.id, name: user.name, email: user.email, image: user.image, rememberMe: credentials.rememberMe === "true" } as any;
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rememberMe = (user as any).rememberMe ?? true; // Discord always remembers
        if (!rememberMe) token.expiresAt = Date.now() + 24 * 60 * 60 * 1000;

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
            const discordId = account.providerAccountId;
            let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
            if (!dbUser) {
              dbUser = await prisma.user.create({
                data: { email: user.email, name: user.name ?? null, image: user.image ?? null, discordId },
              });
            } else {
              const upd: Record<string, string> = { discordId };
              if (user.image && !dbUser.image) upd.image = user.image;
              await prisma.user.update({ where: { id: dbUser.id }, data: upd });
            }
            token.id = dbUser.id;
          }
        } else {
          token.id = user.id;
        }
      }
      // Expire non-remember-me sessions after 24h
      if (token.expiresAt && Date.now() > (token.expiresAt as number)) return null;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id as string;
      if (token.email) session.user.email = token.email as string;
      return session;
    },
  },
});

import NextAuth, {
  type User,
  type NextAuthConfig,
  type DefaultSession,
} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import prisma from '@/lib/prisma';
import { AdapterUser } from 'next-auth/adapters';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log('🚀 ~ authorized ~ auth:', auth);
      // const isLoggedIn = !!auth?.user;
      // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      // if (isOnDashboard) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/dashboard', nextUrl));
      // }
      return true;
    },

    async jwt({ token, user }) {
      if (user) token.data = user;

      return token;
    },

    async session({ session, token }) {
      session.user = token.data as any;
      return session;
    },
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) return null;

        const isValid = bcryptjs.compareSync(password, user.password);

        if (!isValid) return null;

        const { password: _, ...rest } = user;

        return rest;
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);

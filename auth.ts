import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import * as bcrypt from 'bcrypt';
import { getDb } from '@/lib/db';
import { User, UserRole } from './entities/user.entity';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 14 * 24 * 60 * 60,
  }, // easiest with custom DB
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().toLowerCase().trim();
        const password = credentials?.password?.toString();

        if (!email || !password) return null;

        const db = await getDb();
        const repo = db.getRepository(User);

        const user = await repo.findOne({ where: { email } });
        if (!user?.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Only on sign-in (credentials or google)
      if (user?.email) {
        const db = await getDb();
        const repo = db.getRepository(User);

        const email = user.email.toLowerCase();
        let dbUser = await repo.findOne({ where: { email } });

        const isGoogle = account?.provider === 'google';

        if (!dbUser) {
          dbUser = repo.create({
            email,
            name: user.name ?? email.split('@')[0],
            // ✅ Google users considered verified
            emailVerifiedAt: isGoogle ? new Date() : null,
            role: UserRole.USER,

            password: null,

            profileImageUrl: (user as any).image ?? null,
            profileImageKey: null,
          });

          await repo.save(dbUser);
        } else {
          // If user exists and logs in with Google, mark as verified (backfill)
          if (isGoogle && !dbUser.emailVerifiedAt) {
            dbUser.emailVerifiedAt = new Date();
            await repo.save(dbUser);
          }
        }

        (token as any).id = dbUser.id;
        (token as any).role = dbUser.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as any;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

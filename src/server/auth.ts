/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { GetServerSidePropsContext } from "next";
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@/env";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: "ADMIN" | "USER";
    };
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id ?? "",
          email: token.email ?? "",
        },
      };
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //@ts-ignore
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      type: "credentials",
      authorize: async (credentials) => {
        const { email, password } = loginUserSchema.parse(credentials);
        const user = await db.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (user && bcrypt?.compareSync(password, user?.password ?? "")) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/signup",
  },
  secret: env.NEXTAUTH_SECRET,
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

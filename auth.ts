import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import Google from "next-auth/providers/google";
import { SignInSchema } from "./lib/validation";
import { api } from "./lib/api";
import { IAccountDoc } from "./database/account.model";

import { IUserDoc } from "./database/user.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedData = SignInSchema.safeParse(credentials);
        if (validatedData.success) {
          const { email, password } = validatedData.data;

          const { data: existingAccount } = (await api.accounts.getByProvider(
            email
          )) as ActionResponse<IAccountDoc>;

          if (!existingAccount) {
            return null;
          }
          console.log(existingAccount);

          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString()
          )) as SuccessResponse<IUserDoc>;

          if (!existingUser) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password!
          );

          if (isValidPassword) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.avatarURL,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId
          )) as SuccessResponse<IAccountDoc>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }

      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        avatarURL: user.image || "",
        username: user.name?.toLowerCase().replace(/\s+/g, "_") || "",
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "google",
        providerAccountId: account.providerAccountId,
      })) as SuccessResponse<IAccountDoc>;

      if (!success) return false;

      return true;
    },
  },
});

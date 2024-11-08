import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  InactiveAccountError,
  InvalidEmailPasswordError,
} from "./utils/errors";
import { sendRequest } from "./utils/api";
import { IUser } from "./types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // console.log("check credentials", credentials);

        const res = await sendRequest<IBackendRes<ILogin>>({
          method: "POST",
          url: "http://localhost:8080/api/auth/login",
          body: {
            username: credentials.email,
            password: credentials.password,
          },
        });
        // console.log("check user000", res);

        // data sẽ lưu vào trong session
        // nextAuth có hai cơ chế là lưu ở db hoặc jwt
        if (res.statusCode === 201) {
          return {
            _id: res.data?.user?._id,
            name: res.data?.user?.name,
            email: res.data?.user?.email,
            access_token: res.data?.access_token,
          };
        }
        // error pass
        else if (+res.statusCode === 401) {
          throw new InvalidEmailPasswordError();
        }
        // inActive account
        else if (+res.statusCode === 400) {
          throw new InactiveAccountError();
        } else {
          throw new Error("Internal server error");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.user = user as IUser;
      }
      return token;
    },
    session({ session, token }) {
      (session.user as IUser) = token.user;
      return session;
    },
  },
});

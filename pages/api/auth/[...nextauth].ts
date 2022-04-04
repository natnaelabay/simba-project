import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "../../../lib/prisma";
import * as bcrypt from "bcrypt";

let user = null;

const configuration = {
  authorizationURL: "http://localhost:3000/transactions",
  cookie: {
    secure: process.env.NODE_ENV && process.env.NODE_ENV === "production",
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60
  },
  callback: {
    jwt: ({ token, user }) => {
      if (user)
        token.id = user.id
      return token
    },
    session: async ({session,token, user}) => {
      session.user = user
      session.token = token
      return Promise.resolve(session)
    },
    redirect: async (url, baseUrl) => {
      return url.startsWith(baseUrl)
        ? Promise.resolve(url)
        : Promise.resolve(baseUrl)
    },
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    }

  },
  pages: {
    signIn: "/signIn",
    newUser: "/transactions"

  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: {
          type: "text",
          placeholder: "Email",
        },
        password: {
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
        });
        console.log(credentials)
        if (user !== null) {
          const isMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isMatch) {
            console.log({
              name: user.name,
              email: user.email,
              ...user
            });

            return {
              name: user.name,
              email: user.email,
              ...user
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    },
    ),
  ],
  secret: "thisisasecret",

};
export default (req, res) => NextAuth(req, res, configuration);

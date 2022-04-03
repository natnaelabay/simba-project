import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";
import * as bcrypt from "bcrypt";

let user = null;

const configuration = {
  cookie: {
    secure: process.env.NODE_ENV && process.env.NODE_ENV === "production",
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        Email: {
          type: "text",
          placeholder: "Email",
        },
        Password: {
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.Email,
          },
        });

        if (user !== null) {
          const isMatch = await bcrypt.compare(
            credentials.Password,
            user.password
          );
          if (isMatch) {
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
    }),
  ],

};
export default (req, res) => NextAuth(req, res, configuration);
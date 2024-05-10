import "next-auth";
import { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: Boolean;
    isAcceptingMessages?: Boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: Boolean;
      isAcceptingMessages?: Boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: Boolean;
    isAcceptingMessages?: Boolean;
    username?: string;
  }
}

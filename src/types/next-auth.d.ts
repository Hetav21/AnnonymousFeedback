import "next-auth";
import { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    _id?: String;
    isVerified?: Boolean;
    isAcceptingMessages?: Boolean;
    username?: String;
  }
  interface Session {
    user: {
      _id?: String;
      isVerified?: Boolean;
      isAcceptingMessages?: Boolean;
      username?: String;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: String;
    isVerified?: Boolean;
    isAcceptingMessages?: Boolean;
    username?: String;
  }
}

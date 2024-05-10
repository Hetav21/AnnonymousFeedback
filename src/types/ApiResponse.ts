import { Message } from "@/model/Message";
import { User } from "@/model/User";
// import { User  } from "@prisma/client";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
  user?: {
    userId?: string;
    username?: User["username"];
    email?: User["email"];
    isAcceptingMessage?: User["isAcceptingMessage"];
    isVerified?: User["isVerified"];
    messages?: User["messages"];
  }
}

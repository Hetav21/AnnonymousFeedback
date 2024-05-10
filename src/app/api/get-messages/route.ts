import { AUTH_OPTIONS } from "@/lib/auth";
import prisma from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(AUTH_OPTIONS);

    const user: User = session!.user as User;

    if (!session || !user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const userId = user._id; // FIXME: Mongo can throw some error due to _id being string type instead of ObjectId

    try {
      // const messages = await UserModel.aggregate([
      //   {$match: {_id: userId,}},
      //   {$unwind: "$messages"},
      //   {$sort: {"messages.createdAt": -1}},
      //   {$group: {_id: '$_id', messages: {$push: '$messages'}}}
      // ])

      const messages = await prisma.message.groupBy({
        where: {
          userId,
        },
        by: ["msgId", "createdAt", "content"],
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log(messages);

      if (!messages || messages.length === 0) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "No messages found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Messages found",
        },
        { status: 200 }
      );
    } catch (e) {
      console.log(e);

      return NextResponse.json<ApiResponse>({
        success: false,
        message: "",
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

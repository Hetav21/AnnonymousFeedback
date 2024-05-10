import prisma from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, content } = await request.json();

    const dbUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!dbUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!dbUser.isAcceptingMessage) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        userId: dbUser.userId,
      },
    });

    if (!message) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Message not sent",
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Message sent",
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
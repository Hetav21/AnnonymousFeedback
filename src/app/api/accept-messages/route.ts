import { AUTH_OPTIONS } from "@/lib/auth";
import prisma from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { User } from "next-auth";
import { User as UserType } from "@/model/User";

export async function POST(request: NextRequest) {
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

    const userId = user._id;

    const { acceptMessages } = await request.json();

    const dbUser = prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        isAcceptingMessage: acceptMessages,
      },
    });

    if (!dbUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Error Updating Messages Acceptance",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Messages Acceptance Updated",
    });
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

    const userId = user._id;

    const dbUser = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        isAcceptingMessage: true,
        userId: true,
        username: true,
        email: true,
        isVerified: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Error Getting Message Acceptance",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Messages Acceptance Updated",
      user: dbUser,
    });
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

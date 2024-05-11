import prisma from "@/lib/dbConnect";
import { userNameValidation } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const validateInput = UsernameQuerySchema.safeParse(queryParams);

    if (!validateInput.success) {
      const usernameErrors =
        validateInput.error.format().username?._errors || [];

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid Username",
        },
        { status: 400 }
      );
    }

    const { username } = validateInput.data;

    const user = await prisma.user.findUnique({
      where: {
        username,
        AND: {
          isVerified: true
        }
      }
    });  

    if (user != undefined) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Username is taken",
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error Checking Username",
      },
      { status: 500 }
    );
  }
}

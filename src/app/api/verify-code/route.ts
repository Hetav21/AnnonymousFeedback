import prisma from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, code } = await request.json();

    const decodedUsername =  decodeURIComponent(username)
 
    const dbUser = await prisma.user.findUnique({
        where: {
            username: decodedUsername
        }
    })   

    if(!dbUser) {
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "User not found"
        }, { status: 404 })
    }

    if(dbUser.isVerified){
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "User already verified"
        }, { status: 200 })
    }

    const isCodeValid = (dbUser.verifyCode === code)
    const isCodeExpired = (new Date(dbUser.verifyCodeExpiry) > new Date())

    if(!isCodeExpired) {
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Verify Code Expired"
        }, { status: 400 })
    }

    if (!isCodeValid) {
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Incorrect Code"
        } , { status: 403 })
    }

    const user = prisma.user.update({
        where: {
            userId: dbUser.userId
        },
        data: {
            isVerified: true
        }
    })

    return NextResponse.json<ApiResponse>({
        success: true,
        message: "User Verified"
    })

  } catch (e) {
    console.error(e);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Server Error",
      },
      { status: 400 }
    );
  }
}

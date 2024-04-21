import dbConnect from "@/deprecated/dbConnect";
import { sendVerificationEmail } from "@/helpers/verificationMail";
import { ApiResponse } from "@/types/ApiResponse";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    await dbConnect();

    try {

        const {username, email, password} = await req.json();


    } catch (error) {
        console.error("Error Registering User: ", error);

        return NextResponse.json({
            success: false,
            message: "Error Registering User"
        }, {
            status: 403
        })  
    }

}
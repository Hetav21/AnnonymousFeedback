import dbConnect from "@/deprecated/dbConnect";
import { sendVerificationEmail } from "@/helpers/verificationMail";
import prisma from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponse";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    await dbConnect();

    try {

        const {username, email, password} = await req.json();

        const existingUserVerifiedByUsername = await prisma.user.findUnique({
            where: {
                username: username,
                isVerified: true
            }
        });          

        if(existingUserVerifiedByUsername != undefined){
            return NextResponse.json({
                success: false,
                message: "Username is already taken"
            }
            , {
                status: 400
            });
        }

        const existingUserVerifiedByEmail = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserVerifiedByEmail != undefined){
            if (existingUserVerifiedByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "Email is already taken"
                }
                , {
                    status: 400
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                const emailResponse = await sendVerificationEmail(email, username, verifyCode);
                
                const user = await prisma.user.update({
                    where: {
                        email: email
                    },
                    data: existingUserVerifiedByEmail
                });
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const expiryDate = new Date();

            expiryDate.setHours(expiryDate.getHours() + 1);
            
            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode, 
                    isVerified: false,
                    verifyCodeExpiry: expiryDate,
                    isAcceptingMessage: true,
                }
            });
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

            if(!emailResponse.success){
                return NextResponse.json({
                    success: false,
                    message: emailResponse.message
                }, {status: 500});
            } 

            return NextResponse.json({
                success: true,
                message: "User Registered Successfully. Please verify your email address."
            }, {status: 201})
 
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
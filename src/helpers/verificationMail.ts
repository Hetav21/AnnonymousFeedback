import { resend } from "@/lib/emailer";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Annonymous Feedback: Verification Code",
            react: VerificationEmail({username, otp: verifyCode}),
        })

        return {
            success: true,
            message: "Verification email sent successfully"
        }
    } catch (emailError) {
        console.error("Error sending verification email");
        
        return {
            success: false,
            message: "Error sending verification email"
        }
    }
}
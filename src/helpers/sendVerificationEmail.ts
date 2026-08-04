import { resend } from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Cypher | Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
        });
        return { success: false, message: "Failed to send verification mail" }
        
    } catch (err) {
        console.log("Error sending Verification Email: ", err);
        return { success: false, message: "Failed to send verification mail" }
    }
}
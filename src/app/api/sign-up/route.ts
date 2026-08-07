import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import { dbConnect } from "@/lib/dbConnect"
import UserModel from "@/models/user"
import bcrypt from "bcryptjs"


export async function POST(request: Request) {
    await dbConnect()
    try {
        const { email, username, password } = await request.json()

        const userVerifiedByUsername = await UserModel.findOne({ username, isVerified: true })
        if (userVerifiedByUsername) {
            return Response.json(
                { success: false, message: "Username already exists" },
                { status: 500 }
            )
        }

        const userByMail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000+Math.random()*900000).toString()

        if (userByMail) {
            if(userByMail.isVerified){
                return Response.json(
                    { success: false, message: "Failed to signup user" },
                    { status: 500 }
                )
            }else{
                const hashedPassword = await bcrypt.hash(password, 10)
                userByMail.password = hashedPassword;
                userByMail.verifyCode = verifyCode;
                userByMail.verifyCodeExpiry = new Date(Date.now()+3600000)

                await userByMail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)  // setting expiry 1 hr after sending verification code
            const user = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            user.save()
        }

        const emailResponse = await sendVerificationEmail(email,username,verifyCode);
        if(!emailResponse.success){
            return Response.json(
                { success: false, message: emailResponse.message },
                { status: 201 }
            )
        }

        return Response.json(
            { success: true, message: "User signup confirmed. Verify your email" },
            { status: 201 }
        )

    } catch (err) {
        console.error("Error during user signup", err)
        return Response.json(
            { success: false, message: "Failed to signup user" },
            { status: 500 }
        )
    }
}
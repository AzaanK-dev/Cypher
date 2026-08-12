import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { usernameValidation } from "@/schemas/signUpSchema";
import z from "zod";

// reason for this
// Frontend validation can be bypassed.
// For example, your frontend might have: usernameValidation
// but somebody can completely bypass your UI and call:
// GET /api/check-username?username=a DIRECTLY.
// SO IT will stop that

const UsernameQuerySchema = z.object({
    username: usernameValidation    
})

export async function GET(request:Request) {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        // is username valid (zod validation)
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result); 
        
        if(!result.success){
            const errors = result.error.format().username?._errors
            return Response.json({
                success: false,
                message: "Invalid query params"
            },{status:400})
        }

        // is username already exists (availabilty check)
        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({
            username, isVerified:true
        })
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username already exists"
            },{status:500})
        }

        return Response.json({
            success: true,
            message: "Username is available"
        },{status:200})

    } catch (error) {
        console.log("Error while checking username availability", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        },{status:500})
    }
}
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import mongoose from "mongoose";
import UserModel from "@/models/user";


async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not authnticated"
        },{ status:405 })
    }
    const userId = new mongoose.Types.ObjectId(session?.user._id)
    try {
        const user = await UserModel.aggregate([
            {
                $match: {id: userId}   
            },
            {
                $unwind: "$messages"   // takes an array inside a document and creates a separate document for each array element.
            },
            {
                $sort: {"$messages.createdAt": -1}
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages"  
                    }
                }
            }
        ])
        
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{ status:404 })
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        },{ status:200 })

    } catch (error) {
        console.log("Error while getting messages");
        return Response.json({
            success: false,
            message: "Error while getting messages"
        },{ status:500 })
        
    }
}
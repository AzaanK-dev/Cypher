import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user";

export async function POST(request: Request) {    // for accepting messages toggle status
    await dbConnect();

    const session = await getServerSession(authOptions)  // Checks whether the user is logged in.
    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    const userId = session?.user._id;
    const { acceptMessages } = await request.json()  // true/false decides whether a user is currently allowing other people to send them messages.

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessage: acceptMessages
        }, { new: true })

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "User accept messages status is not updated"
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User accept messages status is updated successfully",
            updatedUser
        }, { status: 200 })


    } catch (error) {
        console.log("Error while updating accept messages status", error);
        return Response.json({
            success: false,
            message: "User accept messages status is not updated"
        }, { status: 500 })

    }

}

export async function GET(request: Request) {     // for fetching isAcceptingMessages status
    await dbConnect();

    const session = await getServerSession(authOptions)  // Checks whether the user is logged in.
    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }
    const userId = session?.user._id;

    try {
        const user = await UserModel.findById(userId)
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "User accept messages status is fetched successfully",
            isAcceptingMessage: user.isAcceptingMessage
        }, { status: 200 })


    } catch (error) {
        console.log("Error while fetching accept messages status", error);
        return Response.json({
            success: false,
            message: "User accept messages status is not fetched"
        }, { status: 500 })

    }
}
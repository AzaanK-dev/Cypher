import { Message } from "@/models/user";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;    // optional: only for few APIs (not for signup/signin)
    messages?: Array<Message>
}
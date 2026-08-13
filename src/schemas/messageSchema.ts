import { z } from "zod";

export const acceptMessageSchema = z.object({
    content: z
        .string()
        .min(5,{message: "Content must be more than 5 characters"})
        .max(300,{message: "Content must be less than 300 characters"})
})
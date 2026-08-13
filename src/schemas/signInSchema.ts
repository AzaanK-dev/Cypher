import { z } from "zod";

export const signInSchema = z.object({
    identifier: z.string(),   // username OR email
    password: z.string()
})
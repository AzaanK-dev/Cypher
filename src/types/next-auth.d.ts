import NextAuth, { DefaultSession } from "next-auth";

// from https://next-auth.js.org/getting-started/typescript#adapters
declare module "next-auth" {
    interface User {
        _id?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages: boolean;
    }
    interface Session {
        user: {
            _id?: string;
            username?: string;
            isVerified?: boolean;
            isAcceptingMessages: boolean;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages: boolean;
    }
}


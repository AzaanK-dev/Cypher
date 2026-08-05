import { dbConnect } from "@/lib/dbConnect"
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { signIn } from "next-auth/react";

// from next-auth documentation in configuration/credentials
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier.email },
                            { username: credentials.identifier.username },
                        ]
                    })
                    if (!user) throw new Error("User not found with this email/username")
                    if (!user.isVerified) throw new Error("User not verified yet")

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("Password is Incorrect");
                    }

                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user, }) {
            token._id = user._id?.toString();
            token.username = user.username;
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
            }
            return session
        },
    },

    pages: {
        signIn: "/sign-in",
    },

    session: {
        strategy: "jwt"
    },
    
    secret: process.env.NEXTAUTH_SECRET,
}
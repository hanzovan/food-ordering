import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "mongoose";
import { User } from "@/models/User";
import bcrypt from "bcrypt";

interface Credentials {
    email: string;
    password: string;
}

const handler = NextAuth({
    secret: process.env.SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            id: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "YourEmail@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Record<"email" | "password", string> | undefined) {
                if (!credentials) {
                    console.log("Credentials did not exist")
                    return null;
                }

                const email = credentials.email;
                const password = credentials.password;

                if (!email || !password) {
                    console.log("Missing email or password")
                    return null;
                }
                
                await connect(process.env.MONGO_URL!);
                
                const user = await User.findOne({ email }).exec();

                if (!user) {
                    console.log("User not found");
                    return null;
                }

                const passwordOk = await bcrypt.compare(password, user.password);

                console.log({ passwordOk });

                if (!passwordOk) {
                    console.log("Wrong password")
                }
                else {
                    console.log("Valid credentials");
                    return { id: user._id.toString(), email: user.email };
                }
                
                return null;
            }
        })
    ]
});

export { handler as GET, handler as POST }


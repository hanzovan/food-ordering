import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "mongoose";
import { User } from "@/models/User";
import bcrypt from "bcrypt";

import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/libs/mongoConnect";

import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Adapter } from "next-auth/adapters";

interface Credentials {
    email: string;
    password: string;
}

const handler = NextAuth({
    secret: process.env.SECRET,
    
    // adapter: MongoDBAdapter(clientPromise) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
          }),
        CredentialsProvider({
            name: "Credentials",
            id: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "YourEmail@example.com" },
                password: { label: "Password", type: "password" }
            },            
                async authorize(credentials: Credentials | undefined) {
                if (!credentials) {
                    console.log("Credentials did not exist")
                    return null;
                }

                // const { email, password } = credentials;
                const email = credentials.email;
                const password = credentials.password;

                if (!email || !password) {
                    console.log("Missing email or password")
                    return null;
                }
                
                await connect(process.env.MONGO_URL!);
                
                const MongoUser = await User.findOne({ email }).exec();

                if (!MongoUser) {
                    console.log("User not found");
                    return null;
                }

                const passwordOk = await bcrypt.compare(password, MongoUser.password);

                console.log({ passwordOk });

                if (!passwordOk) {
                    console.log("Wrong password")
                }
                else {
                    console.log("Valid credentials");

                    const user = { id: MongoUser._id.toString(), name: MongoUser.name, email: MongoUser.email, image: MongoUser.image }

                    // Return a simple user object instead of MongoDB user, which will raise Error in authorize function
                    return user;
                }
                
                return null;
            }
        })
    ]
});

export { handler as GET, handler as POST }


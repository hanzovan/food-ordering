import { User } from "@/models/User";
import { connect } from "mongoose";
import { type NextRequest } from "next/server";
import bcrypt from "bcrypt";

// Handle POST request by an asynchronous function
export async function POST(request: NextRequest) {
    // Establish connection with MongoDB
    await connect(process.env.MONGO_URL || '');

    // Destructure email and password from request body
    const { email, password } = await request.json();

    try {
        // Find the user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            console.log("User not found");
            return new Response(JSON.stringify({ errors: ['Invalid email or password!'] }), { status: 403 });
        }
        // Compare provided credentials
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("Invalid password")
            return new Response(JSON.stringify({ errors: ["Invalid email or password!"] }), { status: 401 });
        } else {
            return new Response(JSON.stringify({ message: "Login successfully" }), { status: 200 });
        }        
    } catch (error) {
        console.error("Login error:", error);
        return new Response(JSON.stringify({ errors: ["An unexpected error occurred"] }), { status: 500 });
    }
}
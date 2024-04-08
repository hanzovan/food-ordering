import { User } from "@/models/User";
import { connect } from "mongoose";
import { type NextRequest } from "next/server";

// Handle POST request by an asynchronous function
export async function POST(request: NextRequest) {
    // Establish connection with MongoDB
    await connect(process.env.MONGO_URL || '');

    // Destructure email and password from request body
    const { email, password } = await request.json();

    try {
        // with provided email and password, create new user
        const createdUser = await User.create({ email, password });
        return new Response(JSON.stringify({ message: `Created user: ${email} successfully!` }), { status: 200 });
    } catch (error: any) {
        console.error("Error creating user:", error);

        // Check for duplicate key error
        if (error.code === 11000) {
            return new Response(JSON.stringify({ errors: ['Email already exists.'] }), { status: 400 });
        }
        // Check if the error is a mongoose validation error
        else if (error.name === 'ValidationError') {
            // extracts all validation error messages from Mongoose error object
            const validationMessages = Object.values(error.errors).map((err: any) => err.message);

            // Send error messages to the client side in structured format
            return new Response(JSON.stringify({ errors: validationMessages }), { status: 400 });
        }
        return new Response(JSON.stringify({ errors: ['An unexpected error occurred'] }), { status: 500 });
    }
}
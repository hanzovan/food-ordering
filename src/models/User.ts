// Import libraries for database modeling and password hashing
import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";

// Define an interface for the user model to ensure type safety
interface IUser {
    name: string;
    email: string;
    password: string;
    image: string;
}

// Create a Mongoose schema for users with typed fields for email and password
const UserSchema = new Schema<IUser>({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true,
        validate: {
            // Ensure user create secured password
            validator: function(password: string) {
                const specialCharPattern = /[~!@#$%^&*()_+\[\]{}?]/;
                const hasSpecialChar = specialCharPattern.test(password);
                const hasNumber = /\d/.test(password);
                const hasAlphabet = /[a-zA-Z]/.test(password);
                const hasUpperCase = /[A-Z]/.test(password);
                const isLongEnough = password.length >= 6;

                return hasSpecialChar && hasNumber && hasAlphabet && hasUpperCase && isLongEnough;
            },
            message: "Your password need to have at least 6 characters with not only normal character, but also number and special character"
        }
    },
    image: { type: String }
}, {timestamps: true});

// Use a Mongoose 'pre-save' hook to hash the user's password before saving to the database
UserSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        try {
            // Generate a salt
            const salt = await bcrypt.genSalt(10);
            // Hash the password with the salt
            user.password = await bcrypt.hash(user.password, salt);
        } catch (error: any) {
            next(error);
        }        
    }
    // Proceed to the next middleware if there's no error
    next();
});

// Compile and export the user model. Use the existing compiled model if it exists to prevent recompileation errors
export const User = models.User as mongoose.Model<IUser> || model<IUser>("User", UserSchema);
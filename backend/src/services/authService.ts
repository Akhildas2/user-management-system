import User from "../config/models/userModels";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
// Ensure JWT_SECRET is defined

const JWT_SECRET = process.env.JWT_SECRET ;
console.log("jwt",JWT_SECRET);
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

// Validate the user credentials
export const login = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return null;
    }
    // Generate JWT
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
    return { token, user };
}

// Create a new user
export const register = async (name: string, email: string, phone: number, password: string) => {
    if (await User.findOne({ email })) return null;
    const newUser = await User.create({ name, email, phone, password })
    // Generate JWT for the new user
    const token = jwt.sign(
        { userId: newUser._id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { token, user: newUser };
};

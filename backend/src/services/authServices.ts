import User from "../config/models/userModels";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Ensure secrets are defined
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error("JWT secrets are not defined in the environment variables");
}

// Function to generate an access token
const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
};

// Function to generate a refresh token
const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Validate the user credentials
export const login = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return null;
    }
    const payload = { userId: user._id, email: user.email };

    // Generate tokens
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, user };
}

// Create a new user
export const register = async (name: string, email: string, phone: number, password: string) => {
    if (await User.findOne({ $or: [{ email }, { phone }] })) return null;

    const newUser = await User.create({ name, email, phone, password })
    const payload = { userId: newUser._id, email: newUser.email };

    // Generate token
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, user: newUser };
};

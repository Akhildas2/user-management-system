import { Request, Response } from "express";
import * as authService from "../services/authServices";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }
        const result = await authService.login(email, password);
        if (!result) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }
        // Store refresh token in HTTP-only cookie
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send access token in the response body
        res.json({
            message: 'Login successful',
            accessToken: result.accessToken,
            user: result.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error!' });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            res.status(400).json({ message: 'All fields are required.' });
            return;
        }

        const newUser = await authService.register(name, email, phone, password);
        if (!newUser) {
            res.status(409).json({ message: 'User already exists.' });
            return;
        }

        // Store refresh token in HTTP-only cookie
        res.cookie("refreshToken", newUser.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send access token in the response body
        res.status(201).json({
            message: 'User created successfully',
            accessToken: newUser.accessToken,
            user: newUser.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error!' });
    }
};


export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(401).json({ message: "Refresh token is missing" });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as jwt.JwtPayload;

        // Generate a new access token
        const accessToken = jwt.sign(
            { userId: decoded.userId, email: decoded.email },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "10m" }
        );

        res.status(200).json({
            message: "Access token refreshed",
            accessToken,
        });
    } catch (error) {
        console.error(error);
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ message: "Invalid or expired refresh token" });
        } else {
            res.status(500).json({ msg: "Internal Server Error!" });
        }
    }
};


export const logout = async (req: Request, res: Response): Promise<void> => {
    try {

        // Clear the refresh token by setting an expired cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 0,  // Immediately expire the cookie
        });

        // Optionally, send a response to the client to indicate successful logout
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error!' });
    }
}
import { Request, Response } from "express";
import * as authService from "../services/authServices";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ status: 'error', message: 'Email and password are required.' });
            return;
        }

        const result = await authService.login(email, password);
        if (!result) {
            res.status(401).json({ status: 'error', message: 'Invalid login credentials.' });
            return;
        }

        if (result.user.isBlocked) {
            res.status(403).json({ status: 'error', message: 'Your account is blocked. Contact support.' });
            return;
        }
        
        // Store refresh token in HTTP-only cookie
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
        });

        // Send access token in the response body
        res.json({
            status: 'success',
            message: 'Login successful',
            accessToken: result.accessToken,
            user: result.user
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error!' });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            res.status(400).json({ status: 'error', message: 'All fields are required.' });
            return;
        }

        const newUser = await authService.register(name, email, phone, password);
        if (!newUser) {
            res.status(409).json({ status: 'error', message: 'User already exists.' });
            return;
        }

        // Store refresh token in HTTP-only cookie
        res.cookie("refreshToken", newUser.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
        });

        // Send access token in the response body
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            accessToken: newUser.accessToken,
            user: newUser.user
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error!' });
    }
};


export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(401).json({ status: 'error', message: "Refresh token is missing" });
        return;
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
            status: 'success',
            message: "Access token refreshed",
            accessToken,
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ status: 'error', message: "Invalid or expired refresh token" });
        } else {
            res.status(500).json({ status: 'error', message: "Internal Server Error!" });
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
        res.status(200).json({ status: 'success', message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error!' });
    }
}
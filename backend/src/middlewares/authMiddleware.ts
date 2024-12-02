import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthUserReq from "../interfaces/UserAuthRequest";

// Ensure ACCESS_TOKEN_SECRET is defined
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables");
}

export const authenticateToken = (req: AuthUserReq, res: Response, next: NextFunction): void => {

    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
        req.user = decoded; // Attach decoded token payload to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error("Token verification failed:", err);
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

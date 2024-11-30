import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthUserReq from "../interfaces/UserAuthRequest";


// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

export const authenticateToken = (req: AuthUserReq, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify the token using the JWT_SECRET
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token." });
    }
};
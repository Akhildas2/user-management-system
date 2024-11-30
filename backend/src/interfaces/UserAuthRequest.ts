import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export default interface AuthUserReq extends Request {
    user?: string | JwtPayload;
}
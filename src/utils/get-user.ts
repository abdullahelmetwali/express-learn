import jwt from "jsonwebtoken";
import { Request } from "express";
import { UserTypo } from "../types";
import { JWT_SECRET } from "../config/env";
import { USERS_MODEL } from "../models/users.model";

export const GET_USER: (req: Request) => Promise<UserTypo | Error> = async (req) => {
    const AUTHORIZATION = req.header("Authorization");

    if (!AUTHORIZATION) {
        return new Error("Authorization header not found");
    }

    const token = AUTHORIZATION.split(" ")[1];

    if (!token || token === "undefined" || token === "null" || token.trim() === "") {
        return new Error("Token not found");
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET as string);

        if (!decoded || !decoded.userId) {
            return new Error("Invalid token");
        }

        const userID = decoded.userId;
        const user = await USERS_MODEL.findById(userID) as UserTypo;

        if (!user) {
            return new Error("User not found");
        }

        return user;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return new Error("Token expired");
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return new Error("Invalid or malformed token");
        }
        return new Error(error instanceof Error ? error.message : "An unknown error occurred");
    }
};
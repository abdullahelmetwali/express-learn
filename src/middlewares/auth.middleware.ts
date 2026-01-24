import { JWT_SECRET } from "../config/env";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function AUTH_MIDDLEWARE(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        };

        jwt.verify(token, JWT_SECRET as string, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Unauthorized and invalid token"
                })
            };

            const decodedToken = decoded as any;
            const userRole = decodedToken?.role;

            if (userRole !== "admin") {
                return res.status(401).json({
                    message: "Unauthorized, dont have permission"
                })
            }

            next();
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
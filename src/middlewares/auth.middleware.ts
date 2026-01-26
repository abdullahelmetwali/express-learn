import { Request, Response, NextFunction } from "express";
import { GET_USER } from "../utils/get-user";

export async function AUTH_MIDDLEWARE(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = await GET_USER(req);
        if (user instanceof Error) {
            return res.status(401).json({
                message: user?.message
            });
        };

        const userRole = user.role;

        if (userRole !== "admin") {
            return res.status(403).json({
                message: "Forbidden: You do not have permission to access this resource"
            });
        }

        next();

    } catch (error: Error | any) {
        return res.status(500).json({
            message: error?.message || "Internal server error in authentication"
        });
    }
};

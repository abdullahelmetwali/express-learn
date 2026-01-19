// controller play as a func to make logic in it
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { startSession } from "mongoose";

import { UserTypo } from "@/types";
import { JWT_EXPIRES_IN, JWT_SECRET } from "@/config/env";
import { CustomValidationError } from "@/classes";
import { USERS_MODEL } from "@/models/users.model";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const session = await startSession();
    session.startTransaction();
    try {
        const { email, name, password } = req.body as UserTypo;

        // check if user exists , to avoid making the whole logic
        const isExisting = await USERS_MODEL.findOne({ email });
        const passswordLength = password.length < 8;

        if (isExisting) {
            const err = new CustomValidationError(409, { email: "Email is already token" });
            throw err;
        };

        if (passswordLength) {
            const err = new CustomValidationError(409, { password: "Password must be more than 12 letters" });
            throw err;
        }
        // hash passsword for security
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user , here mongoose will also validate (required, minlength, etc.)
        const newUser = await USERS_MODEL.create(
            [{ name, email, password: hashedPassword }],
            { session }
        );

        if (!newUser[0] || !JWT_SECRET || !JWT_EXPIRES_IN) {
            throw new Error("User creation failed");
        };

        const token = jwt.sign(
            { userId: newUser[0].id },
            JWT_SECRET,
            // expires in seconds
            { expiresIn: Number(JWT_EXPIRES_IN) || 3600 }
        );

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUser[0]
            }
        })
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

export const signIn = async (req: Request, res: Response) => {
    const session = await startSession();
    session.startTransaction();
    try {
        const { email, password } = req.body as UserTypo;
        const user = await USERS_MODEL.findOne({ email });

        if (!user) {
            const err = new CustomValidationError(404, { email: "No email with this data" });
            throw err;
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const err = new CustomValidationError(400, { password: "Incorrect password" });
            throw err;
        };

        if (!JWT_SECRET) {
            const err: any = new Error("Token Invalid");
            err.name = "JsonWebTokenError"
            throw err;
        };

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: Number(JWT_EXPIRES_IN) || 3600 }
        );

        return res.status(200).json({
            token,
            user
        })
    } catch (error) {
        await session.abortTransaction();
    } finally {
        session.endSession();
    }
};

export const signOut = async (req: Request, res: Response) => {

};
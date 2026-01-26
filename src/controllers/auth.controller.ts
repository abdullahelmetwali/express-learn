// controller play as a func to make logic in it
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserTypo } from "../types";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env";
import { CustomValidationError } from "../classes";
import { USERS_MODEL } from "../models/users.model";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, password, phone, role, gender } = req.body as UserTypo;

        // check if user exists , to avoid making the whole logic
        const isExisting = await USERS_MODEL.findOne({ email, phone });
        const passswordLength = password.length < 12;

        let errors: Record<string, string> = {};

        if (isExisting?.email) errors.email = "Email is already token before";
        if (isExisting?.phone) errors.phone = "Phone is already token before";
        if (!gender) errors.gender = "Please select your gender";
        if (passswordLength) errors.password = "Password must be more than 12 letters";

        if (Object.keys(errors).length > 0) {
            throw new CustomValidationError(409, errors);
        }

        // hash passsword for security
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await USERS_MODEL.create({
            name: name,
            email: email,
            phone: String(phone),
            role: role,
            password: hashedPassword
        });

        if (!newUser || !JWT_SECRET || !JWT_EXPIRES_IN) {
            throw new Error("User creation failed");
        };

        const token = jwt.sign(
            { userId: newUser.id, role: role },
            JWT_SECRET,
            // expires in seconds
            { expiresIn: Number(JWT_EXPIRES_IN) || 3600 }
        );

        const userObject = newUser.toObject();
        delete (userObject as any).password;

        return res.status(201).json({
            data: {
                token,
                user: userObject
            }
        });

    } catch (error) {
        next(error);
    }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as UserTypo;
        const user = await USERS_MODEL.findOne({ email });

        let errors: Record<string, string> = {};

        if (!user) {
            errors.message = "Invalid email or password";
            throw new CustomValidationError(409, errors);
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            errors.message = "Invalid email or password";
            throw new CustomValidationError(409, errors);
        };

        if (!JWT_SECRET) {
            const err: any = new Error("Token Invalid");
            err.name = "JsonWebTokenError"
            throw err;
        };

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: Number(JWT_EXPIRES_IN) || 3600 }
        );

        return res.status(200).json({
            data: {
                token,
                user
            }
        })
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req: Request, res: Response) => {

};
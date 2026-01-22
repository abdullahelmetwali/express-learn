import { ValidationErrors } from "../types";
import { Request, Response, NextFunction } from "express";

export function ERROR_MIDDLEWARE(
    err: any,
    _: Request,
    res: Response,
    __: NextFunction
) {
    try {
        let statusCode = err.statusCode || 500;
        let message = err.message || "Server error";
        let errors: ValidationErrors | null = null;

        console.log("from error middlware");
        console.log(err);

        // invalid id format => CastError 
        // the id entered not like mongoose id => 12 byte ( 12 characters )
        if (err.name === "CastError") {
            statusCode = 404;
            message = `Invalid ${err.path} format entered`;
        }

        // duplicate error 
        if (err.code === 11000) {
            statusCode = 409;
            message = "Duplicate field value";
            errors = {};

            // Extract the field name from the error
            const field = Object.keys(err.keyPattern || err.keyValue || {})[0];
            if (field) {
                errors[field] = `This ${field} has been taken`;
            }
        }

        // validation errors comes from => Scheme ( model )
        if (err.name === "ValidationError") {
            statusCode = 400;
            message = "Validation failed";
            errors = {};

            // Transform validation errors into field-specific messages
            Object.keys(err.errors).forEach((key) => {
                errors![key] = err.errors[key].message;
            });
        }

        // custom validation errors comes form => controller (funcs that handles logic)
        if (err.name === "CustomValidationError" && err.errors) {
            statusCode = err.statusCode || 400;
            message = "Validation failed";
            errors = err.errors;
        }

        // jwt errs
        if (err.name === "JsonWebTokenError") {
            statusCode = 401;
            message = "Invalid token";
        }

        if (err.name === "TokenExpiredError") {
            statusCode = 401;
            message = "Token expired";
        }

        // response structure
        const response: any = {
            success: false,
            message,
        };

        // apply errors obj in response 
        if (errors && Object.keys(errors).length > 0) {
            response.errors = errors;
        }

        res.status(statusCode).json(response);
    } catch (error) {
        // Fallback error response
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
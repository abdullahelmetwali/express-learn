import { ValidationErrors } from "../types";

export class CustomValidationError {
    name: string = "CustomValidationError";
    message: string = "Validation Error";
    statusCode!: number;
    errors!: ValidationErrors;

    constructor(statusCode: number, errors: ValidationErrors) {
        this.statusCode = statusCode;
        this.errors = errors;
    }
};
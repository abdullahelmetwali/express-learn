import { NextFunction, Request, Response } from "express";
import { startSession } from "mongoose";

import { CustomValidationError } from "@/classes";
import { PRODUCTS_MODEL } from "@/models/products.model";
import { ProductTypo } from "@/types";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const session = await startSession();
    session.startTransaction();
    try {
        const body: ProductTypo = req.body;
        const name = body.name;
        const isExsits = await PRODUCTS_MODEL.exists({ name });

        if (isExsits) {
            const err = new CustomValidationError(404, { name: "This name has been applied in another product" });
            throw err;
        };

        const newProduct = await PRODUCTS_MODEL.create(
            [{ ...body }],
            { session }
        );

        if (!newProduct[0]) {
            throw new Error("Product creation failed");
        };

        await session.commitTransaction();

        return res.status(201).json({
            ...newProduct[0],
        });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};
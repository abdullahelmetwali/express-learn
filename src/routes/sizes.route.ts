import { Router } from "express";

import { AUTH_MIDDLEWARE } from "../middlewares/auth.middleware";
import { SIZES_MODEL } from "../models/sizes.model";
import {
    createSize,
    updateSize,
    restoreSize,
    softDeleteSize,
    hardDeleteSize
} from "../controllers/sizes.controller";

const SIZES_ROUTE = Router();

// all sizes
SIZES_ROUTE.get("/", async (_, res) => {
    try {
        const sizes = await SIZES_MODEL.find({
            isDeleted: false
        }).lean();

        return res.status(200).json({ ...sizes });
    } catch (error: Error | any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// deleted sizes
SIZES_ROUTE.get("/deleted", AUTH_MIDDLEWARE, async (_, res) => {
    try {
        const sizes = await SIZES_MODEL.find({
            isDeleted: true
        }).lean();

        return res.status(200).json({
            data: [
                ...sizes
            ],
        })
    } catch (error: Error | any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// create new size
SIZES_ROUTE.post("/", AUTH_MIDDLEWARE, createSize);

// update size
SIZES_ROUTE.put("/:id", AUTH_MIDDLEWARE, updateSize);

// soft delete
SIZES_ROUTE.delete("/soft/:id", AUTH_MIDDLEWARE, softDeleteSize);

// hard delete
SIZES_ROUTE.delete("/hard/:id", AUTH_MIDDLEWARE, hardDeleteSize);

// restore size
SIZES_ROUTE.patch("/restore/:id", AUTH_MIDDLEWARE, restoreSize);

export default SIZES_ROUTE;
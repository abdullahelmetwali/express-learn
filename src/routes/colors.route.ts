import { Router } from "express";

import { AUTH_MIDDLEWARE } from "../middlewares/auth.middleware";
import { COLORS_MODEL } from "../models/colors.model";
import {
    createColor,
    hardDeleteColor,
    restoreColor,
    softDeleteColor,
    updateColor
} from "../controllers/colors.controller";

const COLORS_ROUTE = Router();

// all color 
COLORS_ROUTE.get("/", async (_, res) => {
    try {
        // const colors = await COLORS_MODEL.db.dropDatabase();
        const colors = await COLORS_MODEL.find({ isDeleted: false }).lean();
        return res.status(200).json({ colors });
    } catch (error: Error | any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// deleted colors
COLORS_ROUTE.get("/deleted", AUTH_MIDDLEWARE, async (_, res) => {
    try {
        const colors = await COLORS_MODEL.find({ isDeleted: true }).lean();
        return res.status(200).json({
            data: [
                ...colors
            ]
        })
    } catch (error: Error | any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// create new color
COLORS_ROUTE.post("/", AUTH_MIDDLEWARE, createColor);

// update color
COLORS_ROUTE.put("/:id", AUTH_MIDDLEWARE, updateColor);

// soft delete
COLORS_ROUTE.delete("/soft/:id", AUTH_MIDDLEWARE, softDeleteColor);

// hard delete
COLORS_ROUTE.delete("/hard/:id", AUTH_MIDDLEWARE, hardDeleteColor);

// restore color
COLORS_ROUTE.patch("/restore/:id", AUTH_MIDDLEWARE, restoreColor);

export default COLORS_ROUTE;
import { Router } from "express";

import { COLORS_MODEL } from "../models/colors.model";
import { createColor, hardDeleteColor, restoreColor, softDeleteColor, updateColor } from "../controllers/colors.controller";

const COLORS_ROUTE = Router();

// all color 
COLORS_ROUTE.get("/", async (_, res) => {
    try {
        // const colors = await COLORS_MODEL.db.dropDatabase();
        const colors = await COLORS_MODEL.find({ isDeleted: false }).lean();
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

// deleted colors
COLORS_ROUTE.get("/deleted", async (_, res) => {
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
COLORS_ROUTE.post("/", createColor);

// update color
COLORS_ROUTE.put("/:id", updateColor);

// soft delete
COLORS_ROUTE.delete("/soft/:id", softDeleteColor);

// hard delete
COLORS_ROUTE.delete("/hard/:id", hardDeleteColor);

// restore color
COLORS_ROUTE.patch("/restore/:id", restoreColor);

export default COLORS_ROUTE;
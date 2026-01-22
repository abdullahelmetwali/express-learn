import { Router } from "express";

import { CATEGORIES_MODEL } from "../models/categories.model";
import { createCategory, updateCategory, softDeleteCategory, hardDeleteCategory, restoreCategory } from "../controllers/categories.controller";

const CATEGORIES_ROUTE = Router();

// all categories 
CATEGORIES_ROUTE.get("/", async (_, res) => {
    try {
        const categories = await CATEGORIES_MODEL.find({ isDeleted: false }).lean();
        return res.json({
            data: categories
        })
    } catch (error: Error | any) {
        return res.status(500).json({
            error: error?.message
        })
    }
});

// deleted categories
CATEGORIES_ROUTE.get("/deleted", async (_, res) => {
    try {
        const categories = await CATEGORIES_MODEL.find({ isDeleted: true }).lean();
        return res.json({
            data: categories
        })
    } catch (error: Error | any) {
        return res.status(500).json({
            error: error?.message
        })
    }
});

// create category
CATEGORIES_ROUTE.post("/", createCategory);

// update category
CATEGORIES_ROUTE.put("/:id", updateCategory);

// soft delete
CATEGORIES_ROUTE.delete("/soft/:id", softDeleteCategory);

// hard delete
CATEGORIES_ROUTE.delete("/hard/:id", hardDeleteCategory);

// restore category
CATEGORIES_ROUTE.patch("/restore/:id", restoreCategory);

export default CATEGORIES_ROUTE;
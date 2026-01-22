import { Router } from "express";

import { PRODUCTS_MODEL } from "../models/products.model";
import {
    createProduct,
    hardDeleteProduct,
    restoreProduct,
    softDeleteProduct,
    updateProduct
} from "../controllers/products.controller";

const PRODUCTS_ROUTE = Router();

// all products (not deleted) 
PRODUCTS_ROUTE.get("/", async (_, res) => {
    try {
        const products = await PRODUCTS_MODEL.find({ isDeleted: false, }).lean();
        return res.json({
            data: products
        })
    } catch (error: Error | any) {
        return res.json({
            error: error?.message
        })
    }
});

// deleted products
PRODUCTS_ROUTE.get("/deleted", async (_, res) => {
    try {
        const products = await PRODUCTS_MODEL.find({ isDeleted: true }).lean();
        return res.json({
            data: products
        })
    } catch (error: Error | any) {
        return res.json({
            error: error?.message
        })
    }
});

// create product 
PRODUCTS_ROUTE.post("/", createProduct);

// update product
PRODUCTS_ROUTE.put("/:id", updateProduct);

// soft delete
PRODUCTS_ROUTE.delete("/:id", softDeleteProduct);

// hard delete
PRODUCTS_ROUTE.delete("/hard/:id", hardDeleteProduct);

// restore category
PRODUCTS_ROUTE.patch("/restore/:id", restoreProduct);

export default PRODUCTS_ROUTE;
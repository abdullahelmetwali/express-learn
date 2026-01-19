import { createProduct } from "@/controllers/products.controller";
import { PRODUCTS_MODEL } from "@/models/products.model";
import { Router } from "express";

const PRODUCTS_ROUTE = Router();

PRODUCTS_ROUTE.get("/", async (_, res) => {
    try {
        const products = await PRODUCTS_MODEL.find({}).lean();
        return res.json({
            data: products
        })
    } catch (error: Error | any) {
        return res.json({
            error: error?.message
        })
    }
});

PRODUCTS_ROUTE.post("/", createProduct)
export default PRODUCTS_ROUTE;
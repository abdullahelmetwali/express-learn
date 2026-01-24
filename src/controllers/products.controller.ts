import { NextFunction, Request, Response } from "express";
import { startSession } from "mongoose";

import { ProductTypo } from "../types";
import { CustomValidationError } from "../classes";

import { PRODUCTS_MODEL } from "../models/products.model";
import { COLORS_MODEL } from "../models/colors.model";
import { SIZES_MODEL } from "../models/sizes.model";
import { CATEGORIES_MODEL } from "../models/categories.model";

import { softDeleteUtility } from "../utils/soft-delete";
import { hardDeleteUtility } from "../utils/hard-delete";
import { restoreUtility } from "../utils/restore";

export const filterProucts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category, size, color, price, status } = req.query;
        const filter: Record<string, any> = { isDeleted: false };

        if (category) filter.categories = category;
        if (size) filter.sizes = size;
        if (color) filter.colors = color;
        if (status) filter.status = status;

        const products = await PRODUCTS_MODEL.find(filter).lean();
        return res.status(200).json({ products });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const session = await startSession();
    session.startTransaction();
    try {
        const { name, colors, sizes, categories, status } = req.body as ProductTypo;

        const [anotherProduct, hasColors, hasSizes, hasCategories] = await Promise.all([
            PRODUCTS_MODEL.findOne({ name: name }).session(session),
            COLORS_MODEL.find({ _id: { $in: colors }, isDeleted: false }).select("_id").session(session),
            SIZES_MODEL.find({ _id: { $in: sizes }, isDeleted: false }).select("_id").session(session),
            CATEGORIES_MODEL.find({ _id: { $in: categories }, isDeleted: false }).select("_id").session(session),
        ]);

        let errors: Record<string, string> = {};

        if (anotherProduct) {
            if (anotherProduct.isDeleted) {
                errors.name = "This name exists in a deleted product, check it";
            } else {
                errors.name = "This name exists in another product";
            }
        };
        if (status !== "0" && status !== "1") errors.status = "Status must be published or draft";

        if (hasColors.length !== colors?.length) errors.colors = "Color ID does not exist";
        if (hasSizes.length !== sizes?.length) errors.sizes = "Size ID does not exist";
        if (hasCategories.length !== categories?.length) errors.categories = "Category ID does not exist";

        if (Object.keys(errors).length > 0) {
            throw new CustomValidationError(409, errors);
        };

        const newProduct = await PRODUCTS_MODEL.create(
            [{ ...req.body }],
            { session }
        );

        if (!newProduct[0]) {
            throw new Error("Product creation failed");
        };

        await session.commitTransaction();

        return res.status(201).json({
            ...newProduct[0].toObject(),
        });
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        next(error);
    } finally {
        session.endSession();
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const session = await startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const { name, colors, sizes, categories, status } = req.body as ProductTypo;

        const thisProduct = await PRODUCTS_MODEL.findById(id).session(session);
        if (!thisProduct) {
            throw new Error("Product not found");
        };

        const [anotherProduct, hasColors, hasSizes, hasCategories] = await Promise.all([
            PRODUCTS_MODEL.findOne({ _id: { $ne: id }, name: name }).session(session),
            COLORS_MODEL.find({ _id: { $in: colors }, isDeleted: false }).select("_id").session(session),
            SIZES_MODEL.find({ _id: { $in: sizes }, isDeleted: false }).select("_id").session(session),
            CATEGORIES_MODEL.find({ _id: { $in: categories }, isDeleted: false }).select("_id").session(session),
        ]);

        let errors: Record<string, string> = {};

        if (anotherProduct) {
            if (anotherProduct.isDeleted) {
                errors.name = "This name exists in a deleted product, check it";
            } else {
                errors.name = "This name exists in another product";
            }
        };

        if (status !== "0" && status !== "1") errors.status = "Status must be published or draft";

        if (hasColors.length !== colors?.length) errors.colors = "Color ID does not exist";
        if (hasSizes.length !== sizes?.length) errors.sizes = "Size ID does not exist";
        if (hasCategories.length !== categories?.length) errors.categories = "Category ID does not exist";

        if (Object.keys(errors).length > 0) {
            throw new CustomValidationError(409, errors);
        };

        // updating 
        thisProduct.name = name;
        thisProduct.status = status;

        thisProduct.colors = colors;
        thisProduct.sizes = sizes;
        thisProduct.categories = categories;

        await thisProduct.save();
        await session.commitTransaction();

        return res.status(201).json(thisProduct.toObject());
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        next(error);
    } finally {
        session.endSession();
    }
};

export const softDeleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const softDeleted = await softDeleteUtility(id as string, PRODUCTS_MODEL, "product");
        return res.status(200).json({
            message: `${softDeleted.name} soft deleted successfully`
        });
    } catch (error) {
        next(error);
    }
};

export const hardDeleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const hardDeleted = await hardDeleteUtility(id as string, PRODUCTS_MODEL, "product");
        return res.status(200).json({
            message: `${hardDeleted.name} deleted forever successfully`
        });
    } catch (error) {
        next(error);
    }
};

export const restoreProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const restored = await restoreUtility(id as string, PRODUCTS_MODEL, "product");
        return res.status(200).json({
            message: `${restored.name} restored successfully`
        });
    } catch (error) {
        next(error);
    };
};
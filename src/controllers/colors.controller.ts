import { Request, Response, NextFunction } from "express";

import { CustomValidationError } from "@/classes";
import { COLORS_MODEL } from "@/models/colors.model";

import { softDeleteUtility } from "@/utils/soft-delete";
import { hardDeleteUtility } from "@/utils/hard-delete";
import { restoreUtility } from "@/utils/restore";

export const createColor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, value } = req.body;
        const isExsits = await COLORS_MODEL.findOne({ name, value });

        if (isExsits) {
            if (isExsits.isDeleted) throw new Error("This color is deleted , check it");

            const errors = {
                ...(isExsits.name && name ? { name: "This name already exists" } : {}),
                ...(isExsits.value && value ? { value: "This value already exists" } : {}),
            };

            throw new CustomValidationError(409, errors);
        }

        const newColor = await COLORS_MODEL.create(req.body);
        return res.status(201).json(newColor);
    } catch (error) {
        next(error);
    };
};

export const updateColor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, status, value } = req.body;

        const thisColor = await COLORS_MODEL.findById(id);
        if (!thisColor) {
            throw new Error("Color not found!");
        };

        // see if there is name or value applied in another color
        if ((name && name !== thisColor.name) || (value && value !== thisColor.value)) {

            const duplicated = await COLORS_MODEL.findOne({
                _id: { $ne: id },
                isDeleted: false,
                $or: [
                    { name },
                    { value }
                ]
            });

            if (duplicated) {
                if (duplicated.name === name) throw new CustomValidationError(409, { name: "This name exists in another color" });
                if (duplicated.value === value) throw new CustomValidationError(409, { value: "This value exists in another color" });
            }
        };

        thisColor.name = name;
        thisColor.value = value;
        if (status !== undefined) thisColor.status = status;

        // save this Color new data after checking all data 
        await thisColor.save();
        return res.status(200).json(thisColor.toObject());
    } catch (error) {
        next(error);
    };
};

export const softDeleteColor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const softDeleted = await softDeleteUtility(id as string, COLORS_MODEL as any, "color");

        return res.status(200).json({
            message: `${softDeleted.name} soft deleted successfully`
        });
    } catch (error) {
        next(error);
    }
};

export const hardDeleteColor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const hardDeleted = await hardDeleteUtility(id as string, COLORS_MODEL, "color");

        return res.status(200).json({
            message: `${hardDeleted.name} deleted forever successfully`
        });
    } catch (error) {
        next(error);
    };
};

export const restoreColor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const restored = await restoreUtility(id as string, COLORS_MODEL, "color");
        return res.status(200).json({
            message: `${restored.name} restored successfully`
        });
    } catch (error) {
        next(error);
    };
};
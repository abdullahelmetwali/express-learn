import { Request, Response, NextFunction } from "express";

import { CustomValidationError } from "@/classes";
import { SIZES_MODEL } from "@/models/sizes.model";

import { softDeleteUtility } from "@/utils/soft-delete";
import { hardDeleteUtility } from "@/utils/hard-delete";
import { restoreUtility } from "@/utils/restore";

export const createSize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const isExsits = await SIZES_MODEL.findOne({ name });

        if (isExsits) {
            if (isExsits.isDeleted) throw new Error("This size is deleted , check it")
            throw new CustomValidationError(409, {
                name: "This name applied in another size"
            });
        };

        const newSize = await SIZES_MODEL.create(req.body);
        return res.status(201).json(newSize);
    } catch (error) {
        next(error);
    };
};

export const updateSize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        // get the size for the session ( user ) is getting it 
        const thisSize = await SIZES_MODEL.findById(id);

        if (!thisSize) {
            throw new Error("Size not found!");
        };

        // see if there is name === the name user updated by 
        if (name && name !== thisSize.name) {
            const anotherSizeWithThisName = await SIZES_MODEL.exists({
                name,
                _id: { $ne: id },
                isDeleted: false
            });

            if (anotherSizeWithThisName) {
                throw new CustomValidationError(409, {
                    name: "This name exists in another size"
                });
            };
        };

        thisSize.name = name;
        if (status !== undefined) thisSize.status = status;

        // save this size new data after checking all data 
        await thisSize.save();
        return res.status(200).json(thisSize.toObject());
    } catch (error) {
        next(error);
    };
};

export const softDeleteSize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const softDeleted = await softDeleteUtility(id as string, SIZES_MODEL as any, "size");

        return res.status(200).json({
            message: `${softDeleted.name} soft deleted successfully`
        });
    } catch (error) {
        next(error);
    }
};

export const hardDeleteSize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const hardDeleted = await hardDeleteUtility(id as string, SIZES_MODEL, "size");

        return res.status(200).json({
            message: `${hardDeleted.name} deleted forever successfully`
        });
    } catch (error) {
        next(error);
    };
};

export const restoreSize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const restored = await restoreUtility(id as string, SIZES_MODEL, "size");
        return res.status(200).json({
            message: `${restored.name} restored successfully`
        });
    } catch (error) {
        next(error);
    };
};
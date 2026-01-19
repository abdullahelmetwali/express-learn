import { model, Schema } from "mongoose";

const SizeSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Size name is required"]
    },
    status: {
        type: String,
        enum: ["0", "1"],
        default: "1",
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

export const SIZES_MODEL = model("Sizes", SizeSchema);
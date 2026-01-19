import { model, Schema } from "mongoose";

const ColorSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Color name is required"]
    },
    value: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: [true, "Color value is required"]
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

export const COLORS_MODEL = model("Colors", ColorSchema);
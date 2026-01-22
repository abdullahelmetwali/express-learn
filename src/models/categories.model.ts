import { makeSlug } from "../utils/make-slug";
import { model, Schema } from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Category name is required"]
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["0", "1"],
        default: "1",
        required: false
    },
}, {
    timestamps: true,
    versionKey: false
});

CategorySchema.pre("save", async function () {
    if (!this.isNew && !this.isModified("name")) return;
    this.slug = await makeSlug(this.name, this.constructor);
});

export const CATEGORIES_MODEL = model("Categories", CategorySchema);
import { makeSlug } from "@/utils/make-slug";
import { model, Schema } from "mongoose";

const ProductSchema = new Schema({
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"]
    },
    description: {
        type: String,
        maxLength: [250, "Max letters for description is 250 letter only"]
    },
    category: {
        type: String,
    },
    sizes: {
        type: [String],
        required: [true, "At least must have one size"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    image: {
        type: String
    },
    colors: {
        type: [String],
    }
}, {
    timestamps: true
});

ProductSchema.pre("save", async function () {
    if (!this.isNew && !this.isModified("name")) return;
    this.slug = await makeSlug(this.name, this.constructor);
});

export const PRODUCTS_MODEL = model("Products", ProductSchema);
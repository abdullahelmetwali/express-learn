import { model, Schema } from "mongoose";
import { makeSlug } from "../utils/make-slug";

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
        required: [true, "Product name is required"]
    },
    description: {
        type: String,
        default: "",
        maxLength: [250, "Max letters for description is 250 letter only"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        validate: {
            validator: (v: number | string) => !isNaN(Number(v)),
            message: "Price must be a valid number"
        },
    },
    oldPrice: {
        type: Number,
        default: 0,
        validate: {
            validator: (v: number | string) => !isNaN(Number(v)),
            message: "Old price must be a valid number"
        },
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
        validate: {
            validator: (v: number | string) => !isNaN(Number(v)),
            message: "Discount must be a number between 0 and 100"
        },
    },
    inStock: {
        type: Number,
        required: [true, "Number of stocks is required"],
        validate: {
            validator: (v: Number | String) => Number(v),
        },
    },
    image: {
        type: String
    },
    categories: {
        type: [String],
        set: (v: string | string[]) => Array.isArray(v) ? v : [v],
        validate: {
            validator: (v: string[]) => v.length > 0,
            message: "At least choose one category"
        },
        required: true
    },
    sizes: {
        type: [String],
        set: (v: string | string[]) => Array.isArray(v) ? v : [v],
        validate: {
            validator: (v: string[]) => v.length > 0,
            message: "At least choose one size"
        },
        required: true
    },
    colors: {
        type: [String],
        set: (v: string | string[]) => Array.isArray(v) ? v : [v],
        validate: {
            validator: (v: string[]) => v.length > 0,
            message: "At least choose one color"
        },
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    addedToCart: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["0", "1"],
        default: "1",
        required: [true, "Product status must be added"]
    }
}, {
    timestamps: true,
    versionKey: false,
});

ProductSchema.pre("save", async function () {
    if (!this.isNew && !this.isModified("discount") && !this.isModified("price")) {
        return;
    };

    if (this.discount && this.discount > 0) {
        const discountAmount = (this.price * Number(this.discount)) / 100;
        this.oldPrice = this.price;
        this.price = this.price - discountAmount;
    };

    if (!this.isNew && !this.isModified("name")) return;
    this.slug = await makeSlug(this.name, this.constructor);
});

export const PRODUCTS_MODEL = model("Products", ProductSchema);
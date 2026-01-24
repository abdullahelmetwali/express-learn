import { makeSlug } from "../utils/make-slug";
import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"],
        minlength: [12, "Name length must be more than 12 letters"],
        maxlength: [200, "Name length must be less than 200 letters"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        lowercase: true,
        minLength: 8,
        maxLength: 255,
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        minLength: 8,
        maxLength: 11,
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        minlength: [12, "Password length must be more than 12 letters"],
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: false
    },
    cart: {
        type: [],
        default: []
    },
    role: {
        type: String,
        required: [true, "User role is required"],
        enum: ["admin", "customer"],
        default: "customer"
    }
}, {
    timestamps: true,
    versionKey: false
});

UserSchema.pre("save", async function () {
    if (!this.isNew && !this.isModified("name")) return;
    this.slug = await makeSlug(this.name, this.constructor);
});

export const USERS_MODEL = model("Users", UserSchema);
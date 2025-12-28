import { Schema, model } from "mongoose";

const userScheme = new Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: 8,
        maxLength: 200
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        lowercase: true,
        minLength: 8,
        maxLength: 255,
    },
    password: {
        type: String,
        trim: true,
        minLength: 8,
        validate: {
            validator: (value: string) => value.length > 8,
            message: "Password must be greater then 8 letters"
        }
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: false
    }
}, {
    timestamps: true,
    methods: {
        getEmail(email) {
            this.email = email
        }
    }
});

const USER = model("User", userScheme);
export default USER;
import mongoose from "mongoose";
import { DB_URI } from "../config/env";

const CONNECT_TO_DATA_BASE = async () => {
    if (!DB_URI) {
        throw new Error("Please there is no db uri")
    };

    try {
        await mongoose.connect(DB_URI);
        console.log("connected to db now")
    } catch (error) {
        console.log(error)
    }
};

export default CONNECT_TO_DATA_BASE;
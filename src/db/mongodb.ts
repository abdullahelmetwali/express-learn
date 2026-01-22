import { connect } from "mongoose";
import { DB_URI } from "../config/env";

export async function CONNECT_TO_DATA_BASE() {
    if (!DB_URI) {
        throw new Error("Please there is no db uri")
    };

    try {
        await connect(DB_URI);
        console.log("connected to db now")
    } catch (error) {
        console.log(`Error connecting to Database : ${error}`)
    }
};
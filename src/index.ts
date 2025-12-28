import { PORT } from "./config/env";

import express, { Request, Response } from "express";
import cookiesParser from 'cookie-parser';

import CONNECT_TO_DATA_BASE from "./db/mongodb";

import USERS_ROUTE from "./routes/users.route";
import AUTH_ROUTE from "./routes/auth.route";

import ERROR_MIDDLEWARE from "./middlewares/error.middleware";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookiesParser());

app.get("/", (request: Request, response: Response) => {
    response.send("Hello this is first backend")
});

(async () => {
    try {
        await CONNECT_TO_DATA_BASE();

        app.use("/api/v1/users", USERS_ROUTE);
        app.use("/api/v1/auth", AUTH_ROUTE);

        app.use(ERROR_MIDDLEWARE);

        app.listen(PORT, () => {
            console.log(`server is running on ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to DB. Server not started.", error);
        process.exit(1);
    }
})();

export default app;
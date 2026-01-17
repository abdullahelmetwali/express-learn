import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { CONNECT_TO_DATA_BASE } from "@/db/mongodb";
import { ERROR_MIDDLEWARE } from "@/middlewares/error.middleware";

import USERS_ROUTE from "@/routes/users.route";
import AUTH_ROUTE from "@/routes/auth.route";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:3000", "domain"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// routes
app.get("/", (req, res) => {
    res.json({ message: "Hi this is the root" });
});

app.use("/api/v1/users", USERS_ROUTE);
app.use("/api/v1/auth", AUTH_ROUTE);

// error handler (last)
app.use(ERROR_MIDDLEWARE);

// ✅ connect DB once (safe for serverless)
CONNECT_TO_DATA_BASE().catch((err) => {
    console.error("MongoDB connection failed", err);
});

export default app;

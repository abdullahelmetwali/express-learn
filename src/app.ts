import "./config/env";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { PORT } from "./config/env";
import { CONNECT_TO_DATA_BASE } from "./db/mongodb";
import { ERROR_MIDDLEWARE } from "./middlewares/error.middleware";

import AUTH_ROUTE from "./routes/auth.route";
import USERS_ROUTE from "./routes/users.route";
import PERMISSIONS_ROUTE from "./routes/permissions.route";

import PRODUCTS_ROUTE from "./routes/products.route";
import INVENTORY_ROUTE from "./routes/inventory.route";
import CATEGORIES_ROUTE from "./routes/categories.route";
import SIZES_ROUTE from "./routes/sizes.route";
import COLORS_ROUTE from "./routes/colors.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS
app.use(
    cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

app.get("/api/v1/", (req, res) => {
    res.json({ message: "Hi this is the root" });
});

// routes
app.use("/api/v1/auth", AUTH_ROUTE);
app.use("/api/v1/users", USERS_ROUTE);
app.use("/api/v1/permissions", PERMISSIONS_ROUTE);

app.use("/api/v1/products", PRODUCTS_ROUTE);
app.use("/api/v1/inventory", INVENTORY_ROUTE);

app.use("/api/v1/categories", CATEGORIES_ROUTE);
app.use("/api/v1/sizes", SIZES_ROUTE);
app.use("/api/v1/colors", COLORS_ROUTE);

// error handler
app.use(ERROR_MIDDLEWARE);

if (process.env.NODE_ENV === "development") {
    app.listen(PORT, () => {
        console.log(`server is running on : http://localhost:${PORT}`);
    });
}

CONNECT_TO_DATA_BASE().catch((err) => {
    console.error("MongoDB connection failed", err);
});

export default app;
import { USERS_MODEL } from "../models/users.model";
import { Router } from "express";

const USERS_ROUTE = Router();

// GET all users => /users
// GET user bg id => /users/:id

USERS_ROUTE.get("/", async (_, res) => {
    try {
        // .lean() -> plain JS objects
        const users = await USERS_MODEL.find({}, { password: 0 }).lean();

        res.json({
            success: true,
            data: users,
        });
    } catch (error: Error | any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

USERS_ROUTE.get("/:slug", (req, res) => res.send({ message: `Get user details for` }));

USERS_ROUTE.post("/", (req, res) => res.send({ message: "Create a user" }));

USERS_ROUTE.put("/:id", (req, res) => res.send({ message: "Update user by id" }));

USERS_ROUTE.delete("/:id", (req, res) => res.send({ message: "Delete user by id" }));

export default USERS_ROUTE;
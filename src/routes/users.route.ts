import USER from "@/models/users.model";
import { Router } from "express";

const USERS_ROUTE = Router();

// GET all users => /users
// GET user bg id => /users/:id

USERS_ROUTE.get("/", async (req, res) => {
    try {
        const users = await USER.find({}, { password: 0 }).lean(); // .lean() -> plain JS objects

        res.json({
            success: true,
            message: "GET all users",
            data: users,          // no need for [ ... ] here unless you really want an array of arrays
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
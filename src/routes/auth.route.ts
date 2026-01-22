// auth.route is for making the routes frontend fetch on it
import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller";

const AUTH_ROUTE = Router();

AUTH_ROUTE.post("/sign-in", signIn);
AUTH_ROUTE.post("/sign-up", signUp);
AUTH_ROUTE.post("/sign-out", signOut);

export default AUTH_ROUTE;
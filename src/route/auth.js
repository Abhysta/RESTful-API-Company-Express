import express from "express";
import authController from "../controller/authController.js";
import cookieParser from "cookie-parser";

export const router = express.Router();
router.use(cookieParser(process.env.COOKIE_SIGNED));
router.post("/auth/registration", authController.registration);
router.post("/auth/login", authController.login);
router.post("/auth/refresh", authController.refreshToken);
router.post("/auth/logout", authController.logout);

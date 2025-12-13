import express from "express";
import { fixCode } from "../controllers/aiFix.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected route
router.post("/fix-code", authMiddleware, fixCode);

export default router;

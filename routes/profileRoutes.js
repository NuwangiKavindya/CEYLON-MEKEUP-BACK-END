import express from "express";
import { getProfile } from "../controllers/authController.js";

const router = express.Router();

router.get("/", getProfile);

export default router;

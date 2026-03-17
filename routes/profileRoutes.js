import express from "express";
import { getProfile, updateUserProfile } from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management (Protected)
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               secondname:
 *                 type: string
 *               dateofbirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Profile updated
 *       500:
 *         description: Server error
 */
router.put("/", authMiddleware, updateUserProfile);

export default router;

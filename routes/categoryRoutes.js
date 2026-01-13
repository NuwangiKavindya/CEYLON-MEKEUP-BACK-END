import express from "express";
import multer from "multer";
import Category from "../models/Category.js";
import path from "path";
import fs from "fs";

const router = express.Router();

const uploadDir = path.join("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) return res.status(400).json({ message: "Name and image required" });
    const imageUrl = `/uploads/${req.file.filename}`;
    const category = new Category({ name, imageUrl });
    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";   // ✅ ADD
import { dirname } from "path";       // ✅ ADD
import Product from "../models/Product.js";

const router = express.Router();

// ✅ Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // ✅ use absolute path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// @route POST /api/products
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, brand, category, price, description, stock } = req.body;

    const newProduct = new Product({
      name,
      brand,
      category,
      price,
      description,
      stock,
      image: req.file ? req.file.filename : null,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add product" });
  }
});

// @route GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

export default router;

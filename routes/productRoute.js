import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";   // ✅ ADD
import { dirname } from "path";       // ✅ ADD
import Product from "../models/product.js";

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

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - brand
 *               - category
 *               - price
 *               - description
 *               - stock
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               stock:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product added successfully
 *       500:
 *         description: Failed to add product
 */
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

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Error fetching products
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

export default router;

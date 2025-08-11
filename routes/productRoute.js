const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProduct
} = require('../controllers/productController');

// Configure Multer storage
const storage = multer.memoryStorage(); // or diskStorage if saving to disk
const upload = multer({ storage });

// Routes
router.get('/', getProducts); // Get all products
router.post('/', upload.single('image'), createProduct); // Create product with image
router.put('/:id', updateProduct); // Update product
router.delete('/:id', deleteProduct); // Delete product
router.post('/add', upload.single('image'), addProduct); // Add product (custom endpoint)

module.exports = router;

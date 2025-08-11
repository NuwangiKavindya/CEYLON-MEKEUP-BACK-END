
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Category = require('../models/category');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // save to /uploads folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });


// Update category
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, details } = req.body;
    const updateData = {
      name,
      details,
    };

    if (req.file) {
      updateData.image = req.file.path; // Save path to DB
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated', category: updatedCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

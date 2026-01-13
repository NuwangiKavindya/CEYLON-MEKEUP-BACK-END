const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  price: Number,
  description: String,
  stock: Number,
  image: String,
});

module.exports = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const mongoose = required("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    details: { type: String },
    image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);


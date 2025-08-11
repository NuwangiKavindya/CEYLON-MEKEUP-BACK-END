const mongoose = requre ("mongoose");

const cartSchema = new mongooose.Schema({
    userId: {type: String, required: true },
    productId: {type: String, required: true },
    quantity: {type: Number, requred: true },

});

module.exports = mongoose.model("Cart", cartSchema);
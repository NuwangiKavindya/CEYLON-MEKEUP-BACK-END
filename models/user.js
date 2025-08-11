const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    secondname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateofbirth: { type: Date, required: true },
    role: { type: String, default: "user" },

}, {Timestamps: true} );

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const user = mongoose.model("User", userSchema);
module.exports = user;




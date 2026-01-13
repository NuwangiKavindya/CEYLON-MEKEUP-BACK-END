import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { firstname, secondname, email, password, dateofbirth } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      secondname,
      email,
      password: hashedPassword,
      dateofbirth
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      firstname: user.firstname,
      secondname: user.secondname,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

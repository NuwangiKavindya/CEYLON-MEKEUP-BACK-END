import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const registerUser = async (req, res) => {
  try {
    const { firstname, secondname, email, password, dateofbirth } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      firstname,
      secondname,
      email,
      password,
      dateofbirth
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    // Use the same error message for security (don't reveal if email exists)
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Removed the problematic console.log(error.message) from here
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        secondname: user.secondname,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { firstname, secondname, dateofbirth } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (firstname) user.firstname = firstname;
    if (secondname) user.secondname = secondname;
    if (dateofbirth) user.dateofbirth = dateofbirth;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

console.log("Hello World");

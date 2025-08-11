const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        const { firstname, secondname, dateofbirth, email, password } = req.body;
        const role = 0;

        const existingUser = await User.findOne({ email});
        if (existingUser) {
            return res. status(400).json({message: 'User already exists'});
        }

        //  create new user 
        const userDetails = new User({firstname, secondname, email, password, dateofbirth, role});
        await userDetails.save();

        res.status(201).json({ message: 'user registered!', user: userDetails });
    } catch (error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//user login function
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password!" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send one successful response
    res.status(200).json({
      message: 'Login Successfully!',
      token,
      user: { email: user.email, firstname: user.firstname },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


module.exports = { registerUser,loginUser };

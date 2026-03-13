const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // 1️⃣ Check required fields
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
  
      // 2️⃣ Check if user exists
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // 3️⃣ Compare password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // 4️⃣ Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      // 5️⃣ Send response
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
module.exports = {
  registerUser,
  loginUser,
};
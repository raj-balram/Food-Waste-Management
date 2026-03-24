import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import jwt from 'jsonwebtoken'

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, location } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      location,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 ADMIN LOGIN (from .env)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { id: "admin", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        _id: "admin",
        name: "Admin",
        email,
        role: "admin",
        token,
      });
    }

    // 👇 NORMAL USER LOGIN (existing code)
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // NGO approval check
      if (user.role === "ngo" && !user.isApproved) {
        return res.status(403).json({
          message: "NGO not approved by admin yet",
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
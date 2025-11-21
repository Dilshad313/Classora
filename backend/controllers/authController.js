import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ADMIN_KEY = "CLASSORA2025";

// REGISTER
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, adminKey } = req.body;

    if (adminKey !== ADMIN_KEY) {
      return res.status(400).json({ message: "Invalid admin key" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      fullName,
      email,
      password: hashed
    });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({
      message: "Admin registered successfully",
      user: admin,
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      message: "Login successful",
      user: admin,
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

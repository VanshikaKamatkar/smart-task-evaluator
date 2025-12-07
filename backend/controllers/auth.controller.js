// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * generateToken
 * Creates a JWT token for the given user payload.
 */
const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * signup
 * Registers a new user.
 * Expected body: { name?, email, password }
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check existing user
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "A user with this email already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: name ? name.trim() : undefined,
      email: email.toLowerCase().trim(),
      password: hashed,
    });

    // Create token (avoid sending password back)
    const token = generateToken({ id: user._id, email: user.email });

    // Respond
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

/**
 * login
 * Authenticates a user and returns a JWT token.
 * Expected body: { email, password }
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken({ id: user._id, email: user.email });

    // Return minimal user data + token
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

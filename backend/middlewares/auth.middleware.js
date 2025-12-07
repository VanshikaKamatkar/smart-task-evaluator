// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * authMiddleware
 * Verifies JWT and attaches user object to req.user (without password).
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Token can be sent in Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Optionally, fetch user from DB (without password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Attach to request and continue
    req.user = user;
    return next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(401).json({ message: "Token verification failed" });
  }
};

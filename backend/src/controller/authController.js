import jwt from "jsonwebtoken";
import User from "../model/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

export const signup = async (req, res) => {
  const { username, fullName, password, role } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      fullName,
      password,
      role: role || "user",
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

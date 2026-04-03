import express from "express";
import User from "../model/User.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin: Find users
router.get("/", protect, restrictTo("admin"), async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile (Settings)
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        role: updatedUser.role,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update PIN
router.put("/pin", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.pin = req.body.pin || user.pin;
      await user.save();
      res.json({ message: "PIN updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

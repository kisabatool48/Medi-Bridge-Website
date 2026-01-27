const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "Email already registered" });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.json({ success: true, message: "Registration successful", user: { id: newUser._id, username: newUser.username, role: newUser.role } });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, error: "Registration failed" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        res.json({ success: true, message: "Login successful", user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, error: "Login failed" });
    }
});

module.exports = router;

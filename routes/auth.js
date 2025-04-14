const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerValidationRules, validateRegistration } = require("../validators/validator");

const router = express.Router();

// Register Route
router.post("/register", registerValidationRules(), async (req, res) => {
    const { fullName, email, password, confirmPassword, currencyPreference } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user and save to the database
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            currencyPreference,
        });

        await newUser.save();
        console.log("New user saved:", newUser);  // Log the new user for debugging

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email }, // Payload for the JWT
            'your_jwt_secret', // Use a secret key here (keep this secure)
            { expiresIn: '1h' } // Set expiration time for the token
        );

        // Send response with the token
        res.status(201).json({
            message: "✅ User registered successfully",
            token, // Send token in response
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "❌ Server error during registration" });
    }
});


// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // Create a JWT token and send it to the client
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token, message: "✅ Login successful" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "❌ Server error during login" });
    }
});

module.exports = router;

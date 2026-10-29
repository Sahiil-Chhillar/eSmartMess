const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { userAuth, isAdmin } = require('../middlewares/auth');
const Complaint = require('../models/Complaint');
const Notice = require('../models/Notice');
const router = express.Router();

// 1.) User Registration
// @route POST /api/user/register
// @desc Register a new user
// @access Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, studentRollNo, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password, studentRollNo, role });
        await user.save();

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: new Date(Date.now() + 8 * 3600000) // 8 hours
        });

        res.json({
            message: "User registered successfully!",
            data: savedUser,
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
});

// 2.) User Login
// @route POST /api/user/login
// @desc Authenticate user
// @access Public
router.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        let user = await User.findOne({ email: emailId });
        if (!user) {
            throw new Error("No such user found");
        }

        const isPasswordValid = await user.matchPassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                expires: new Date(Date.now() + 8 * 3600000) // 8 hours
            });

            res.json({
                message: "User logged in successfully!",
                data: user,
                token: token
            });
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

// 3.) Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.status(200).json({ message: 'Logout successful' });
});

// 4.) User Profile
router.get("/profile", userAuth, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
});

// 5.) Admin Stats
router.get("/stats", userAuth, isAdmin, async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: "student" });
        const pendingComplaints = await Complaint.countDocuments({ status: "Pending" });
        const totalNotices = await Notice.countDocuments();

        res.status(200).json({
            totalStudents,
            pendingComplaints,
            totalNotices,
        });
    } catch (err) {
        console.error("Error fetching admin stats:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;

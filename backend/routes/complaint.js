const express = require("express");
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const { userAuth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// 1. STUDENT POSTS A COMPLAINT (Admins Restricted)
router.post("/create", userAuth, async (req, res) => {
    const { description } = req.body;
    const { id: studentId, role } = req.user; // Extracting role from user

    if (role === "admin") {
        return res.status(403).json({ message: "Admins cannot post complaints" });
    }

    try {
        const complaint = new Complaint({ studentId, description });
        await complaint.save();
        res.status(201).json({ message: "Complaint submitted", complaint });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. ADMIN MARKS A COMPLAINT AS RESOLVED
router.put("/resolve/:id", userAuth, isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const complaint = await Complaint.findByIdAndUpdate(
            id,
            { status: "Resolved" },
            { new: true }
        );

        if (!complaint) return res.status(404).json({ message: "Complaint not found" });

        res.status(200).json({ message: "Complaint marked as resolved", complaint });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. STUDENT FETCHES THEIR COMPLAINTS (Sorted by newest first)
router.get("/my-complaints", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        // console.log(userId);
        const complaints = await Complaint.find({ studentId: (userId) })
            .sort({ createdAt: -1 });

        // console.log(complaints);

        res.status(200).json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 4. ADMIN FETCHES ALL COMPLAINTS (Sorted by newest first)
router.get("/all", userAuth, isAdmin, async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("studentId", "name")
            .sort({ createdAt: -1 }); // Sort in descending order
        res.status(200).json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. ADMIN FETCHES ONLY PENDING COMPLAINTS (Sorted by newest first)
router.get("/pending", userAuth, isAdmin, async (req, res) => {
    try {
        const pendingComplaints = await Complaint.find({ status: "Pending" })
            .populate("studentId", "name")
            .sort({ createdAt: -1 }); // Sort in descending order
        res.status(200).json(pendingComplaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const { userAuth, isAdmin } = require("../middlewares/auth");
const Rebate = require("../models/Rebate");
const Attendance = require("../models/Attendance");

const router = express.Router();
const normalizeDateToUTC = (dateString) => {
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0); // Set to 00:00:00 UTC
    return date;
};

// Apply for a rebate (Only students)
router.post("/apply", userAuth, async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const studentId = req.user.id; // Get from JWT

        // Ensure only students can apply (assuming role is stored in req.user)
        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Only students can apply for rebates." });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize time to midnight

        const requestedStart = new Date(startDate);
        const requestedEnd = new Date(endDate);

        // Students must apply at least a day before
        if (requestedStart < today) {
            return res.status(400).json({ message: "Cannot apply for past dates." });
        }

        // Invalid date range
        if (requestedEnd < requestedStart) {
            return res.status(400).json({ message: "Invalid date range." });
        }

        // Prevent overlapping rebate requests
        const existingRebate = await Rebate.findOne({
            studentId,
            $or: [
                { startDate: { $lte: requestedEnd }, endDate: { $gte: requestedStart } } // Overlapping condition
            ]
        });

        if (existingRebate) {
            return res.status(400).json({ message: "Overlapping rebate request exists." });
        }

        // Save rebate request
        const rebate = new Rebate({
            studentId,
            startDate: normalizeDateToUTC(startDate),
            endDate: normalizeDateToUTC(endDate)
        });

        await rebate.save();

        res.json({ message: "Rebate request submitted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// Approve or Reject Rebate (Only Admins)
router.put("/update/:id", userAuth, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const rebate = await Rebate.findById(req.params.id);
        if (!rebate) return res.status(404).json({ message: "Rebate not found." });

        rebate.status = status;
        await rebate.save();

        if (status === "Approved") {
            // ✅ Mark attendance as ABSENT for rebate days
            const daysAbsent = [];
            let currentDate = new Date(rebate.startDate);

            while (currentDate <= rebate.endDate) {
                daysAbsent.push({
                    studentId: rebate.studentId,
                    date: new Date(currentDate),
                    status: "absent"
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }

            await Attendance.insertMany(daysAbsent);
            // console.log(`✅ Attendance marked as ABSENT for ${daysAbsent.length} days.`);
        }

        res.json({ message: `Rebate ${status.toLowerCase()}.` });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// 🔍 Get all rebate requests (Admin only)
router.get("/all", userAuth, isAdmin, async (req, res) => {
    try {
        const rebates = await Rebate.find().populate("studentId", "name email");
        res.json(rebates);
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// Get all rebates for the logged-in student
router.get("/my-rebates", userAuth, async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Only students can view their rebates." });
        }

        const rebates = await Rebate.find({ studentId: req.user.id }).sort({ createdAt: -1 });
        res.json(rebates);
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;

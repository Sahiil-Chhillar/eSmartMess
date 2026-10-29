const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { userAuth, isAdmin } = require('../middlewares/auth');
const Attendance = require("../models/Attendance");
const Payment = require("../models/Payment");

require("dotenv").config();

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//  Create an Order (Student Requests to Pay)
router.post("/create-order", userAuth, async (req, res) => {
    const { studentId, amount } = req.body;
    const requestingUser = req.user;
    try {
        // Only the student themselves can pay their bill
        if (requestingUser._id.toString() !== studentId) {
            return res.status(403).json({ message: "Only the student can pay their bill." });
        }

        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: `${studentId}_${Math.floor(Date.now() / 100000)}`,
            payment_capture: 1,
        });

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Order creation failed", error });
    }
});

// Verify Payment and Update Database
router.post("/verify-payment", userAuth, async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, studentId } = req.body;

    const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    try {
        // Mark attendance as billed
        await Attendance.updateMany(
            { studentId, is_billed: false },
            { $set: { is_billed: true } }
        );

        // Save transaction record
        const payment = new Payment({
            studentId,
            orderId: razorpay_order_id,
            transactionId: razorpay_payment_id,
            amount: req.body.amount,
            status: "Completed",
            paymentDate: new Date(),
        });

        await payment.save();

        res.json({ success: true, message: "Payment verified, attendance updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating records", error });
    }
});

router.get("/all", userAuth, isAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;

        const payments = await Payment.find()
            .populate('studentId', 'name')
            .sort({ paymentDate: -1 }) // latest first
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalCount = await Payment.countDocuments();

        res.json({
            payments,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: parseInt(page),
            totalCount,
        });
    } catch (error) {
        console.error("Fetch payments error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
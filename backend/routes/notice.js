const express = require("express");
const mongoose = require("mongoose");
const Notice = require("../models/Notice");
const { userAuth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// 1. ADMIN POSTS A NOTICE
router.post("/create", userAuth, isAdmin, async (req, res) => {
    const { title, content } = req.body;

    try {
        const notice = new Notice({ title, content });
        await notice.save();
        res.status(201).json({ message: "Notice created successfully", notice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. STUDENTS FETCH ALL NOTICES (Newest First)
router.get("/all", userAuth, async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 }); // Sorted by newest first
        res.status(200).json(notices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. ADMIN EDITS A NOTICE
router.put("/update/:id", userAuth, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const updatedNotice = await Notice.findByIdAndUpdate(
            id,
            { title, content },
            { new: true, runValidators: true }
        );

        if (!updatedNotice) return res.status(404).json({ message: "Notice not found" });

        res.status(200).json({ message: "Notice updated successfully", updatedNotice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. ADMIN DELETES A NOTICE
router.delete("/delete/:id", userAuth, isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNotice = await Notice.findByIdAndDelete(id);
        if (!deletedNotice) return res.status(404).json({ message: "Notice not found" });

        res.status(200).json({ message: "Notice deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

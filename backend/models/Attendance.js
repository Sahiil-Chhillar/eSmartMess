const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["present", "absent"],
        required: true
    },
    is_billed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);

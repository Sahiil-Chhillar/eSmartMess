const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // This must match the model name used in mongoose.model("User", userSchema)
        required: true,
    },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);

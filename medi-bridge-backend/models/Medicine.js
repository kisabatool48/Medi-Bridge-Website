const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    donorId: { type: String, default: "Anonymous" }, 
    donorName: { type: String, default: "Anonymous" },
    image: String,

    rawOcrText: String,

    name: String, // Mapped to medicineName in user request, but keeping 'name' to match frontend
    strength: String,
    expiry: String,
    batchNo: String,
    quantity: String,
    category: String,
    manufacturer: String,

    status: {
        type: String,
        default: "pending", // pending, approved, rejected, available
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Medicine", medicineSchema);

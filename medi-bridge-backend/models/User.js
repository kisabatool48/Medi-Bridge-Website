const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Simple storage for now, will add hashing if needed
    role: { type: String, default: "donor" }, // donor, hospital, admin
    createdAt: { type: Date, default: Date.now }
}, { collection: 'login' }); // Explicit collection name as requested

module.exports = mongoose.model("User", userSchema);

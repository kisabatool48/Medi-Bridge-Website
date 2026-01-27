const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const medicineRoutes = require("./routes/medicineRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploads if needed

// MongoDB Connection
const mongoUri = "mongodb+srv://kisabatool659_db_user:SNIHoxb19l8cVBjg@medi-bridge.oq8vk2z.mongodb.net/?appName=medi-bridge";

console.log("Attempting to connect to MongoDB...");
mongoose.connect(mongoUri)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch(err => {
        console.error(" MongoDB Connection Error:", err.message);
    });

// Routes
app.use("/api/medicine", medicineRoutes);
app.use("/api/auth", authRoutes); // Auth Routes

// Legacy/Compatibility Redirects (Optional: Remove if you update Frontend immediately)
// Mapping old endpoints to new structure to keep current frontend working partially
const Medicine = require("./models/Medicine");
// We can re-route, but it's better to update frontend. 
// For now, I will let the user know the endpoints changed.

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

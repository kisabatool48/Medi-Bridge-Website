const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const { Jimp } = require("jimp");
const path = require("path");
const fs = require("fs");
const Medicine = require("../models/Medicine");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Scan Medicine (OCR)
router.post("/scan", upload.single("image"), async (req, res) => {
    let processedImagePath = null;
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "No image uploaded" });
        }
        const imagePath = req.file.path;

        // Preprocess image with Jimp
        // Wrap in try-catch to fallback if Jimp fails (e.g. WebP support issues)
        try {
            const image = await Jimp.read(imagePath);
            processedImagePath = path.join("uploads", `processed-${req.file.filename}.png`);

            await image
                .greyscale() // Convert to grayscale
                .contrast(1) // Increase contrast (0 to 1)
                .write(processedImagePath);

            console.log(`Image processed and saved to ${processedImagePath}`);
        } catch (jimpError) {
            console.warn("⚠️ Jimp Preprocessing Failed (skipping):", jimpError.message);
            // Fallback: Use original image
            processedImagePath = imagePath;
        }

        const result = await Tesseract.recognize(
            processedImagePath,
            "eng",
            { logger: m => console.log(m) }
        );
        const text = result.data.text;

        // Save initial pending record as requested
        const medicine = new Medicine({
            donorId: req.body.donorId || "Anonymous",
            rawOcrText: text,
            image: req.file.filename, // Store filename?
            status: "pending"
        });

        const savedMedicine = await medicine.save();

        try {
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            // Only delete processed path if it's different from original and exists
            if (processedImagePath !== imagePath && fs.existsSync(processedImagePath)) {
                fs.unlinkSync(processedImagePath);
            }
        } catch (cleanupError) {
            console.error("Failed to clean up files:", cleanupError);
        }

        res.json({
            success: true,
            ocrText: text,
            medicineId: savedMedicine._id
        });

    } catch (error) {
        console.error("OCR Error:", error);
        res.status(500).json({ success: false, error: "OCR failed: " + error.message });
    }
});

// Update/Confirm Donation (For filling in details after Scan, or direct donation)
// Matching existing /api/donate-medicine logic but mapped to update?
// Or just creating a new one if ID not provided?
// The frontend calls /api/donate-medicine with FULL details.
// To support existing frontend, we'll keep a 'create' route or 'save' route.
router.post("/save", async (req, res) => {
    try {
        console.log("Receiving Donation Data:", req.body);

        // If the frontend sends an ID (from scan), update it. 
        // If not, create new.
        // Current frontend DOES NOT send ID yet. It sends full form data.

        const newMedicine = new Medicine(req.body);
        const savedMedicine = await newMedicine.save();

        console.log("Medicine Saved:", savedMedicine);
        res.json({ success: true, message: "Donation saved successfully!", medicine: savedMedicine });
    } catch (error) {
        console.error("Save Error:", error);
        res.status(500).json({ success: false, error: "Failed to save donation." });
    }
});

// Admin Verify Route (Requested)
router.put("/verify/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const updatedMedicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );
        res.json({ success: true, medicine: updatedMedicine });
    } catch (error) {
        res.status(500).json({ success: false, error: "Verification failed" });
    }
});

// Get Donations (Existing functionality)
router.get("/all", async (req, res) => {
    try {
        const donations = await Medicine.find().sort({ createdAt: -1 });
        res.json({ success: true, donations: donations });
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch donations." });
    }
});

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const Registration = require("./Models/Registration");

const app = express();
const PORT = 3000;

// Middleware for parsing JSON request body
app.use(express.json());

// Database connection
const MONGO_URI = "mongodb://127.0.0.1:27017/campus_event_db";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Database connection failed:", err.message);
    });

// Health check / welcome route
app.get("/", (req, res) => {
    res.send("Campus event registration api is running");
});

// 1. Create a new registration
app.post("/api/registrations", async (req, res) => {
    try {
        const newRegistration = new Registration(req.body);
        const savedData = await newRegistration.save();

        res.status(201).json({
            success: true,
            message: "Registration Successful",
            data: savedData
        });
    } catch (error) {
        // Handle duplicate college email (MongoDB unique constraint)
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email is already registered for the event"
            });
        }

        // Handle Mongoose schema validation errors
        if (error.name === "ValidationError") {
            let errorList = [];
            for (let field in error.errors) {
                errorList.push(error.errors[field].message);
            }
            return res.status(400).json({ errors: errorList });
        }

        console.log("Error creating registration:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// 2. Get all registrations (optional query filtering by eventType and status)
app.get("/api/registrations", async (req, res) => {
    try {
        let filter = {};

        if (req.query.eventType) {
            filter.eventType = req.query.eventType;
        }
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const registrations = await Registration.find(filter);
        res.status(200).json({
            success: true,
            data: registrations
        });
    } catch (err) {
        console.log("Error fetching registrations:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// 3. Get single registration by MongoDB ID
app.get("/api/registrations/:id", async (req, res) => {
    try {
        // Check if ID is a valid MongoDB ObjectId
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid registration ID format" });
        }

        const registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({ message: "Registration not found" });
        }

        res.status(200).json({
            success: true,
            data: registration
        });
    } catch (err) {
        console.log("Error fetching registration:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// 4. Update registration details by ID
app.put("/api/registrations/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid registration ID format" });
        }

        const registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({ message: "Registration not found" });
        }

        // Update fields individually so schema hooks run on save
        if (req.body.studentName !== undefined) registration.studentName = req.body.studentName;
        if (req.body.collegeEmail !== undefined) registration.collegeEmail = req.body.collegeEmail;
        if (req.body.rollNumber !== undefined) registration.rollNumber = req.body.rollNumber;
        if (req.body.eventType !== undefined) registration.eventType = req.body.eventType;
        if (req.body.teamSize !== undefined) registration.teamSize = req.body.teamSize;
        if (req.body.ticketPrice !== undefined) registration.ticketPrice = req.body.ticketPrice;
        if (req.body.discountCode !== undefined) registration.discountCode = req.body.discountCode;
        if (req.body.status !== undefined) registration.status = req.body.status;

        const updatedData = await registration.save();

        res.status(200).json({
            success: true,
            message: "Registration updated successfully",
            data: updatedData
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "This email is already registered for the event"
            });
        }

        if (err.name === "ValidationError") {
            let errorList = [];
            for (let field in err.errors) {
                errorList.push(err.errors[field].message);
            }
            return res.status(400).json({ errors: errorList });
        }

        console.log("Error updating registration:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// 5. Delete registration by ID
app.delete("/api/registrations/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid registration ID format" });
        }

        const deletedData = await Registration.findByIdAndDelete(req.params.id);

        if (!deletedData) {
            return res.status(404).json({ message: "Registration not found" });
        }

        res.status(200).json({
            success: true,
            message: "Registration deleted successfully"
        });
    } catch (err) {
        console.log("Error deleting registration:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

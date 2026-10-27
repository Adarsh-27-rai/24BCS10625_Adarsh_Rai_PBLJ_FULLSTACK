const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(express.json());
const Registration = require("./Models/Registration");


mongoose.connect("mongodb://127.0.0.1:27017/campus_event_db")
    .then(() => {
        console.log("MongoDB connected");

        app.listen(port, () => {
            console.log("Server started");
        });
    }).catch(err => {
        console.log("Database connection failed:", err.message);
    });


app.get("/", (req, res) => {
    res.send("Campus event registration api is running");
});


app.post("/api/registrations", async (req, res) => {
    try {
        const registration = new Registration(req.body);
        await registration.save();

        req.status(201).json({
            success: true,
            message: "Registration Successful",
            data: registration
        })

    } catch(error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "This email is already registered for the event" });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({ errors: Object.values(error.errors).map(e => e.message) });
        }

        res.status(500).json({ message: "Server Error" });
    }
});


app.get("/api/registrations", async (req,res) => {
    try {
        const filter = {};

        if (req.query.eventType) filter.eventType = req.query.eventType;
        if (req.query.status) filter.status = req.query.status;

        const data = await Registration.find(filter);
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


app.get("/api/registrations/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid registration ID format" });
        }

        const data = await Registration.findById(req.params.id);

        if (!data) {
            return res.status(404).json({ message: "Registration not found"  });
        }

        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


app.put("/api/registrations/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid registration ID format"
            });
        }

        const data = await Registration.findById(req.params.id);

        if (!data) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        const fields = ["studentName", "collegeEmail", "rollNumber","eventType", "teamSize", "ticketPrice","discountCode", "status", "registrationDate"];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                data[field] = req.body[field];
            }
        });

        await data.save();

        req.status(200).json({
            success: true,
            message: "Registration updated successfully",
            data
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "This email is already registered for the event" });
        }

        if (err.name === "ValidationError") {
            return res.status(400).json({ errors: Object.values(err.errors).map(e => e.message) });
        }

        res.status(500).json({ message: "Server Error" });
    }
});


app.delete("/api/registrations/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid registration ID format" });
        }

        const data = await Registration.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({ message: "Registration not found" });
        }

        res.status(200).json({
            success: true,
            message: "Registration deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

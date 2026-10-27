const mongoose = require("mongoose");

// Registration Schema for Campus Events
const registrationSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: [true, "Student name is required"],
        trim: true,
        minlength: [3, "Student name must be at least 3 characters long"],
        maxlength: [50, "Student name cannot exceed 50 characters"]
    },
    collegeEmail: {
        type: String,
        required: [true, "College email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w.%+-]+@[\w.-]+\.(edu|ac\.in)$/i, "Must be a valid college email ending in .edu or .ac.in"]
    },
    rollNumber: {
        type: String,
        required: [true, "Roll number is required"],
        uppercase: true,
        trim: true,
        match: [/^[A-Z0-9]{8,10}$/, "Roll number must be 8-10 alphanumeric characters"]
    },
    eventType: {
        type: String,
        required: [true, "Event type is required"],
        enum: {
            values: ["CODING_HACKATHON", "AI_WORKSHOP", "ROBOTICS", "GAMING"],
            message: "{VALUE} is not a valid event type"
        }
    },
    teamSize: {
        type: Number,
        required: [true, "Team size is required"],
        min: [1, "Team size must be at least 1"],
        max: [4, "Team size cannot exceed 4"],
        validate: {
            validator: function(val) {
                return Number.isInteger(val);
            },
            message: "Team size must be an integer"
        }
    },
    ticketPrice: {
        type: Number,
        required: [true, "Ticket price is required"],
        min: [0, "Ticket price cannot be negative"]
    },
    discountCode: {
        type: String,
        trim: true,
        uppercase: true,
        validate: {
            validator: function(code) {
                // discount code is optional, but if entered it must match allowed codes
                if (!code) return true;
                return code === "CAMPUS50" || code === "EARLYBIRD";
            },
            message: "Invalid discount code! Only CAMPUS50 or EARLYBIRD are allowed"
        }
    },
    finalAmount: {
        type: Number,
        required: true,
        min: [0, "Final amount cannot be negative"]
    },
    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "CANCELLED"],
        default: "PENDING"
    },
    registrationDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function(dateVal) {
                return dateVal <= new Date();
            },
            message: "Registration date cannot be in the future"
        }
    }
});

// Middleware to calculate finalAmount and check event rules before validation
registrationSchema.pre("validate", function() {
    // Check AI workshop restriction
    if (this.eventType === "AI_WORKSHOP" && this.teamSize !== 1) {
        this.invalidate("teamSize", "AI Workshop only permits individual registrations");
    }

    // Calculate final ticket amount based on discount
    if (this.discountCode === "CAMPUS50") {
        this.finalAmount = this.ticketPrice * 0.5; // 50% flat discount
    } else if (this.discountCode === "EARLYBIRD") {
        // flat 100 off, but amount should never go below 0
        this.finalAmount = (this.ticketPrice - 100 < 0) ? 0 : (this.ticketPrice - 100);
    } else {
        this.finalAmount = this.ticketPrice;
    }
});

module.exports = mongoose.model("Registration", registrationSchema);
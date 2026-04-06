const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String, // "2026-04-01"
    required: true,
  },
  checkIn: String,
  checkOut: String,
  status: {
    type: String,
    enum: ["on-time", "late"],
  },
  workHours: Number,
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
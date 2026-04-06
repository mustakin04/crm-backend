const express = require("express");
const router = express.Router();



const protect = require("../../middlewares/auth.middleware");
const { checkIn, checkOut, getMyAttendance, getAllAttendance, getDashboardStats, getMonthlyReport } = require("../../controller/attendanceController");

// user
router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);
router.get("/my", protect , getMyAttendance);

// admin
router.get("/all", protect , getAllAttendance);
router.get("/stats", protect , getDashboardStats);
router.get("/monthly-report",protect,getMonthlyReport)
module.exports = router;
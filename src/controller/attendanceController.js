const Attendance = require("../models/Attendance");
// const User = require("../models/User"); // 👈 লাগবে admin part এর জন্য
const User= require("../models/User.model")
const {
  getTodayDate,
  getCurrentTime,
  isLate,
  calculateWorkHours,
} = require("../utils/timeHelper");


// ✅ Check-in (User only)
exports.checkIn = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only employees can check in",
      });
    }

    const userId = req.user._id;
    const today = getTodayDate();

    const existing = await Attendance.findOne({ userId, date: today });

    if (existing) {
      return res.status(400).json({
        message: "Already checked in today",
      });
    }

    const newAttendance = await Attendance.create({
      userId,
      date: today,
      checkIn: getCurrentTime(),
      status: isLate() ? "late" : "on-time",
    });

    res.json({
      message: "Check-in successful",
      data: newAttendance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Check-out (User only)
exports.checkOut = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only employees can check out",
      });
    }

    const userId = req.user._id;
    const today = getTodayDate();

    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance) {
      return res.status(400).json({
        message: "You have not checked in today",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        message: "Already checked out",
      });
    }

    const checkOutTime = getCurrentTime();

    attendance.checkOut = checkOutTime;
    attendance.workHours = calculateWorkHours(
      attendance.checkIn,
      checkOutTime
    );

    await attendance.save();

    res.json({
      message: "Check-out successful",
      data: attendance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Get My Attendance (User)
exports.getMyAttendance = async (req, res) => {
  try {
    const userId = req.user._id;

    const data = await Attendance.find({ userId })
      .sort({ date: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Admin: Get All Attendance
exports.getAllAttendance = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only access" });
    }

    const { date, month, userId, userName, status } = req.query;

    let filter = {};

    // ✅ Date / Month filter
    if (date) {
      filter.date = date;
    } else if (month) {
      const [year, mon] = month.split("-");
      const startDate = `${year}-${mon}-01`;
      const endDate = `${year}-${mon}-31`;
      filter.date = { $gte: startDate, $lte: endDate };
    }

    // ✅ Status
    if (status) filter.status = status;

    // ✅ UserId direct filter
    if (userId) filter.userId = userId;

    // 🔥 ✅ FIX: userName filter (IMPORTANT)
    if (userName) {
      const users = await User.find({
        name: { $regex: userName, $options: "i" },
      }).select("_id");

      const userIds = users.map((u) => u._id);

      filter.userId = { $in: userIds };
    }

    const data = await Attendance.find(filter)
      .populate("userId", "name email role")
      .sort({ date: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin: Dashboard Summary
exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin only access",
      });
    }

    const today = getTodayDate();

    const totalEmployees = await User.countDocuments({ role: "user" });

    const todayAttendance = await Attendance.find({ date: today });

    const present = todayAttendance.length;

    const late = todayAttendance.filter(a => a.status === "late").length;

    const absent = totalEmployees - present;

    res.json({
      totalEmployees,
      present,
      late,
      absent,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/attendance/monthly-report?month=2026-04
exports.getMonthlyReport = async (req, res) => {
  try {
    const { month } = req.query;

    const [year, mon] = month.split("-");
    const start = `${year}-${mon}-01`;
    const end = `${year}-${mon}-31`;

    const data = await Attendance.find({
      date: { $gte: start, $lte: end },
    }).populate("userId", "name");

    const report = {};

    data.forEach((a) => {
      const name = a.userId.name;

      if (!report[name]) {
        report[name] = {
          present: 0,
          late: 0,
          absent: 0,
          totalDays: 0,
        };
      }

      report[name].totalDays++;

      if (a.status === "on-time") report[name].present++;
      if (a.status === "late") report[name].late++;
    });

    // 🔥 Calculate attendance rate
    Object.keys(report).forEach((name) => {
      const user = report[name];

      const attendedDays = user.present + user.late;

      user.attendanceRate = (
        (attendedDays / user.totalDays) *
        100
      ).toFixed(2) + "%";

      // optional: clean remove totalDays if you don't want
      delete user.totalDays;
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
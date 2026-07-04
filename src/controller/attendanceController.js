const Attendance = require("../models/Attendance");
// const User = require("../models/User"); // 👈 লাগবে admin part এর জন্য
const User= require("../models/User.model")
const moment = require("moment");
const {
  getTodayDate,
  getCurrentTime,
  isLate,
  calculateWorkHours,
} = require("../utils/timeHelper");


// ✅ Check-in (User only)
exports.checkIn = async (req, res) => {
  try {
    const OFFICE_IP = "103.17.37.154";

const userIp = req.headers["x-client-ip"];

console.log("Client IP:", userIp);
console.log("Headers:", req.headers);

if (userIp !== OFFICE_IP) {
  return res.status(403).json({
    message: "You must be connected to office WiFi",
  });
}

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

    // Current month (YYYY-MM)
    const currentMonth = moment().format("YYYY-MM");

    const data = await Attendance.find({
      userId,
      date: {
        $gte: `${currentMonth}-01`,
        $lte: `${currentMonth}-31`,
      },
    }).sort({ date: -1 });

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

    if (!month) {
      return res.status(400).json({
        message: "Month is required",
      });
    }

    const [year, mon] = month.split("-");

    const start = moment(
      `${year}-${mon}-01`,
      "YYYY-MM-DD"
    );

    const today = moment();

    const isCurrentMonth =
      today.format("YYYY-MM") === month;

    // 👉 end date fix (current month vs past month)
    const end = isCurrentMonth
      ? today
      : start.clone().endOf("month");

    // All employees
    const users = await User.find({
      role: "user",
    }).select("name");

    // Attendance data
    const data = await Attendance.find({
      date: {
        $gte: start.format("YYYY-MM-DD"),
        $lte: end.format("YYYY-MM-DD"),
      },
    }).populate("userId", "name");

    // 👉 Working days (Friday off + dynamic date range)
    let workingDays = 0;

    for (
      let d = start.clone();
      d.isSameOrBefore(end, "day");
      d.add(1, "day")
    ) {
      // Friday = 5
      if (d.day() !== 5) {
        workingDays++;
      }
    }

    const report = {};

    // initialize all users
    users.forEach((user) => {
      report[user.name] = {
        present: 0,
        late: 0,
        absent: 0,
      };
    });

    // count attendance
    data.forEach((a) => {
      const name = a.userId?.name;

      if (!name || !report[name]) return;

      if (a.status === "on-time") {
        report[name].present++;
      }

      if (a.status === "late") {
        report[name].late++;
      }
    });

    // final calculation
    Object.keys(report).forEach((name) => {
      const attended =
        report[name].present +
        report[name].late;

      report[name].absent = Math.max(
        0,
        workingDays - attended
      );

      report[name].attendanceRate =
        workingDays === 0
          ? "0%"
          : (
              (attended / workingDays) *
              100
            ).toFixed(2) + "%";
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
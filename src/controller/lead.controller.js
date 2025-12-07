const Lead = require("../models/Lead.model");

exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user._id, // 🔥 User-specific
    });

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyLeads = async (req, res) => {
  try {
    let leads;

    // Admin or normal user er jonno populate kore name & role
    if (req.user.role === "admin") {
      leads = await Lead.find().populate("createdBy", "name email role"); // sob lead
    } else {
      leads = await Lead.find({ createdBy: req.user._id }).populate(
        "createdBy",
        "name email role"
      ); // sudhu nijer lead
    }

    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getDashboardData = async (req, res) => {
  try {
    const now = new Date();

    // Today’s starting time (00:00)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    let filter = {};

    // If NOT admin → show only user's leads
    if (req.user.role !== "admin") {
      filter.createdBy = req.user._id;
    }

    // ----------------- Today's Leads -----------------
    const todaysLeads = await Lead.find({
      ...filter,
      createdAt: { $gte: startOfToday }
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email role");

    // ----------------- Recent Leads (Last 7 days) -----------------
    const recentLeads = await Lead.find({
      ...filter,
      createdAt: { $gte: sevenDaysAgo }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("createdBy", "name email role");

    res.json({
      todaysLeads,
      recentLeads,
      todayCount: todaysLeads.length,
      recentCount: recentLeads.length,
    });

  } catch (err) {
    res.status(500).json({ message: "Error loading dashboard" });
  }
};

exports.getLeadCount = async (req, res) => {
  try {
    let count;

    if (req.user.role === "admin") {
      count = await Lead.countDocuments(); // all leads
    } else {
      count = await Lead.countDocuments({ createdBy: req.user._id }); // user-specific leads
    }

    res.json({ totalLeads: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


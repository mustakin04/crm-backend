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
// ⭐ Get Single Lead
exports.getSingleLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id).populate("createdBy", "name email role");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Non-admin access check
    if (req.user.role !== "admin" && lead.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this lead" });
    }

    res.json({ lead });
  } catch (err) {
    console.error("Get single lead error:", err);
    res.status(500).json({ message: err.message });
  }
};
// ⭐ Update Single Lead
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // 🔍 Find lead
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // 🔐 Ownership / role check
    if (
      req.user.role !== "admin" &&
      lead.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this lead" });
    }

    // 🔥 ONLY update non-empty fields (same as code-2)
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== "" && updates[key] !== undefined) {
        lead[key] = updates[key];
      }
    });

    await lead.save();

    res.json({
      message: "Lead updated successfully",
      lead,
    });
  } catch (err) {
    console.error("Update lead error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ⭐ Delete Single Lead
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // ✅ Only admin can delete
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete leads" });
    }

    await lead.deleteOne();

    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    console.error("Delete lead error:", err);
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
// routes/leadSearch.js
// routes/leadSearch.js
exports.getLeadSearch = async (req, res) => {
//   console.log("USER:", req.user);
// console.log("QUERY:", req.query);
  try {
    const { email, phone } = req.query;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone required" });
    }

    const orConditions = [];

    if (email) {
      orConditions.push({ email: email.toLowerCase() });
    }

    if (phone) {
      orConditions.push({ phone });
    }

    let filter = { $or: orConditions };

    // 🔐 Non-admin → only own leads
    if (req.user.role !== "admin") {
      filter.createdBy = req.user._id;
    }

    const leads = await Lead.find(filter)
      .limit(5)
      .populate("createdBy", "name email role");

    res.json(leads);
  } catch (err) {
    console.error("Lead search error:", err);
    res.status(500).json({ message: err.message });
  }
};




const Lead = require("../models/Lead.model");
const csv = require("csv-parser");
const stream = require("stream");
const mapRowToLead = require("../utils/csvMapper");
exports.importLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    const leads = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream
      .pipe(csv())
      .on("data", (row) => {
        // CSV row → Lead object
        const lead = mapRowToLead(row, req.user._id);

        // skip empty row: email or phone missing
        if (!lead.email && !lead.phone) return;

        leads.push(lead);
      })
      .on("end", async () => {
        if (leads.length === 0) {
          return res
            .status(400)
            .json({ message: "No valid leads found in CSV" });
        }

        // Insert all leads in one go
        const inserted = await Lead.insertMany(leads);

        res.status(200).json({
          message: "CSV imported successfully",
          totalInserted: inserted.length,
          data: inserted,
        });
      })
      .on("error", (err) => {
        console.error("CSV parsing error:", err);
        res
          .status(500)
          .json({ message: "CSV parsing failed", error: err.message });
      });
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({ message: error.message });
  }
};

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
        "name email role",
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
    const lead = await Lead.findById(id).populate(
      "createdBy",
      "name email role",
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Non-admin access check
    if (
      req.user.role !== "admin" &&
      lead.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this lead" });
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
    const { dateFilter } = req.query;

    let startDate;
    let endDate = new Date(); // default end date = now

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🗓 Date filter logic
    switch (dateFilter) {
      case "today":
        startDate = today;
        break;

      case "yesterday":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date(today);
        break;

      case "thisWeek":
        startDate = new Date(today);
        const day = startDate.getDay(); // 0 = Sunday
        const diff = day === 0 ? 6 : day - 1; // Monday start
        startDate.setDate(startDate.getDate() - diff);
        break;

      case "thisMonth":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;

      case "last7":
      default:
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 6);
        break;
    }

    // 🔐 Role-based filter
    const filter = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (req.user.role !== "admin") {
      filter.createdBy = req.user._id; // Non-admin → only own leads
    }

    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email role"); // optional: show creator info

    res.status(200).json({ leads });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server Error" });
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

// ⭐ Lead Page – Advanced Filter
exports.filterLeads = async (req, res) => {
  try {
    const {
      search,
      stage,
      owner,
      dateFilter,
      fromDate,
      toDate,
      nextActionType,
      nextActionDate, // ⭐ single date
    } = req.query;
   console.log("Filter Query:", req.query);
 
    let filter = {};

   let sortBy = { createdAt: -1 }; // default
    // 🔐 Role based access
    if (req.user.role !== "admin") {
      filter.createdBy = req.user._id;
    }

    // 🔍 Search: name / email / phone
    if (search) {
      filter.$or = [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    // 🎯 Stage filter
    if (stage) {
      filter.stage = stage;
    }
    // Next Action Type filter
    if (nextActionType) {
      filter.nextAction = nextActionType;;
    }

    // 👤 Owner filter
    if (owner) {
      filter.leadOwner = owner;
    }
    // Next Action Date
if (nextActionDate) {
  filter.nextActionDate = {
    $gte: new Date(`${nextActionDate}T00:00:00.000Z`),
    $lte: new Date(`${nextActionDate}T23:59:59.999Z`),
  };
    console.log("MongoDB এ পাঠানো filter:", JSON.stringify(filter, null, 2));
}


    // 📅 Date filter logic
    const now = new Date();
    let startDate;
    let endDate;

    // always end of today
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    if (fromDate && toDate) {
      // ✅ Custom date range
      startDate = new Date(fromDate);
      endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);
    } else if (dateFilter) {
      switch (dateFilter) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          endDate = endOfToday;
          break;

        case "thisWeek":
          startDate = new Date(now);
          const day = startDate.getDay(); // 0 = Sunday
          const diff = day === 0 ? 6 : day - 1; // Monday start
          startDate.setDate(startDate.getDate() - diff);
          startDate.setHours(0, 0, 0, 0);
          endDate = endOfToday;
          break;

        case "thisMonth":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = endOfToday;
          break;
      }
    }

    if (startDate && endDate) {
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }

    if (startDate) {
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }
    // Next Action থাকলে override করো
    if (nextActionDate || nextActionType) {
  sortBy = { nextActionDate: 1 }; // follow-up priority
}

    const leads = await Lead.find(filter)
  .sort(sortBy)
  .populate("createdBy", "name email role");

   
    res.status(200).json({ leads });
  } catch (err) {
    console.error("Lead filter error:", err);
    res.status(500).json({ message: err.message });
  }
};

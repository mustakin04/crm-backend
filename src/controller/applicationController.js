const Application = require("../models/ApplicationModel");

/* ---------------- CREATE APPLICATION ---------------- */
exports.createApplication = async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      createdBy: req.user._id, // 🔥 SAME AS createLead
    });

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: application,
    });
  } catch (err) {
    console.error("Create application error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ---------------- GET APPLICATIONS (ROLE BASED) ---------------- */
exports.getApplications = async (req, res) => {
  try {
    let applications;
    let count;

    // 👑 Admin → all applications
    if (req.user.role === "admin") {
      applications = await Application.find()
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email role");

      count = await Application.countDocuments();
    }
    // 👤 Normal user → only own applications
    else {
      applications = await Application.find({ createdBy: req.user._id })
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email role");

      count = await Application.countDocuments({
        createdBy: req.user._id,
      });
    }

    res.status(200).json({
      success: true,
      data: applications,
      count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ---------------- UPDATE APPLICATION ---------------- */
exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params; // /api/v1/application/:id
    const updates = req.body;

    // 🔍 find application
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 🔐 user-specific check (admin না হলে own application)
    if (
      req.user.role !== "admin" &&
      application.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }

    // 🔄 update fields
    Object.keys(updates).forEach((key) => {
      application[key] = updates[key];
    });

    await application.save();

    res.json({
      message: "Application updated successfully",
      application,
    });
  } catch (err) {
    console.error("Update application error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- DELETE APPLICATION ---------------- */
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ Only admin can delete
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can delete applications" });
    }

    await application.deleteOne();

    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

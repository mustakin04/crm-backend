const Application=require("../models/ApplicationModel")

exports.createApplication = async (req, res) => {
  try {
    const createdBy = req.user.id; // from auth middleware

    const application = await Application.create({
      ...req.body,
      createdBy,
    });

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: application,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    const count= await Application.countDocuments()
    res.status(200).json({
      success: true,
      data: applications,
      count
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



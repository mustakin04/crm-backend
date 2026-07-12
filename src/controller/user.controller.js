// const User = require("../models/User.model");

const User = require("../models/User.model");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    }).select("_id name email");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, designation, employeeId, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Email Duplicate Check
    if (email && email !== user.email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: user._id },
      });

      if (emailExists) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      user.email = email;
    }

    // Employee ID Duplicate Check
    if (employeeId && employeeId !== user.employeeId) {
      const employeeExists = await User.findOne({
        employeeId,
        _id: { $ne: user._id },
      });

      if (employeeExists) {
        return res.status(400).json({
          message: "Employee ID already exists",
        });
      }

      user.employeeId = employeeId;
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.designation = designation || user.designation;
    user.avatar = avatar || user.avatar;

    await user.save();

    res.status(200).json({
      message: "Profile Updated Successfully",
      user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.status(200).json(user);
};

module.exports = {
  getAllUsers,
  updateProfile,
  getMe
};

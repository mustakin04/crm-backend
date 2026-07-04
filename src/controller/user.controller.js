// const User = require("../models/User.model");

const User = require("../models/User.model");

const getAllUsers = async (
  req,
  res
) => {
  try {
    const users =
      await User.find({
        role: "user",
      }).select(
        "_id name email"
      );

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

module.exports = {
  getAllUsers,
};
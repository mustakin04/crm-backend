const User = require("../models/User.model");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body)
    const user = await User.create({ name, email, password });

    res.json({
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    user,
    token: generateToken(user._id),
  });
};
const getMe = async (req, res) => {
  try {
    const user = req.user; // user populated by auth middleware
    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports={register,login,getMe}
const express = require("express");
const { getAllUsers, updateProfile, getMe } = require("../../controller/user.controller");
const protect = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/get-me",protect,getMe)
router.patch("/update-profile", protect, updateProfile);

module.exports = router;

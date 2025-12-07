const express = require("express");
const route = express.Router();

const protect = require("../../middlewares/auth.middleware")
const { getApplications, createApplication } = require("../../controller/applicationController");


route.post("/createApplication",protect, createApplication);
route.get("/getapplications",protect ,getApplications)

module.exports = route;

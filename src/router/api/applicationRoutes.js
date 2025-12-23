const express = require("express");
const route = express.Router();

const protect = require("../../middlewares/auth.middleware")
const { getApplications, createApplication, deleteApplication, updateApplication } = require("../../controller/applicationController");


route.post("/createApplication",protect, createApplication);
route.get("/getapplications",protect ,getApplications)
route.delete("/deleteApplication/:id",protect,deleteApplication)
route.put("/updateApplicaiton/:id",protect,updateApplication)
module.exports = route;

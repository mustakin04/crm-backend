const express=require("express")
const { createLead, getMyLeads, getDashboardData, getLeadCount, getSingleLead, updateLead, deleteLead,
     getLeadSearch, importLeads, filterLeads, getLeadStages, addCallLog, getCallStats } = require("../../controller/lead.controller")
const protect = require("../../middlewares/auth.middleware")
const upload = require("../../middlewares/upload")


const route=express.Router()
route.post("/import",protect, upload.single("file"),importLeads)
route.post("/createLead",protect, createLead)
route.get("/getLead",protect, getMyLeads)
route.get("/dasboradData",protect, getDashboardData)
route.get("/getLeadCount",protect,getLeadCount)
route.get("/getSingleLead/:id",protect,getSingleLead)
route.put("/updateLead/:id",protect,updateLead)
route.delete("/deleteLead/:id",protect,deleteLead)
route.get("/similar",protect,getLeadSearch)
route.get("/filter",protect,filterLeads)
route.get("/stage",protect,getLeadStages)
route.patch("/add-call/:id", protect,addCallLog);
route.get("/call-stats", protect, getCallStats);
module.exports=route 
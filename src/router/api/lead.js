const express=require("express")
const { createLead, getMyLeads, getDashboardData, getLeadCount, getSingleLead, updateLead, deleteLead, getLeadSearch } = require("../../controller/lead.controller")
const protect = require("../../middlewares/auth.middleware")


const route=express.Router()
route.post("/createLead",protect, createLead)
route.get("/getLead",protect, getMyLeads)
route.get("/dasboradData",protect, getDashboardData)
route.get("/getLeadCount",protect,getLeadCount)
route.get("/getSingleLead/:id",protect,getSingleLead)
route.put("/updateLead/:id",protect,updateLead)
route.delete("/deleteLead/:id",protect,deleteLead)
route.get("/similar",protect,getLeadSearch)
module.exports=route 
const express=require("express")
const { createLead, getMyLeads, getDashboardData, getLeadCount } = require("../../controller/lead.controller")
const protect = require("../../middlewares/auth.middleware")
const { getClientCount } = require("../../controller/clientController")

const route=express.Router()
route.post("/createLead",protect, createLead)
route.get("/getLead",protect, getMyLeads)
route.get("/dasboradData",protect, getDashboardData)
route.get("/getLeadCount",protect,getLeadCount)

module.exports=route 
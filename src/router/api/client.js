const express=require("express")
const protect = require("../../middlewares/auth.middleware")
const { createClient, getMyClients, getDashboardData, getClientCount } = require("../../controller/clientController")
const route=express.Router()
route.post("/createClient",protect, createClient)
route.get("/getClient",protect, getMyClients)
route.get("/getDashboardData",protect, getDashboardData)
route.get("/getClientCount",protect,getClientCount)
module.exports=route
const express=require("express")
const protect = require("../../middlewares/auth.middleware")
const { createClient, getMyClients,getSingleClient,updateClient,deleteClient, getDashboardData, getClientCount, checkClientExists } = require("../../controller/clientController")
const route=express.Router()
route.post("/createClient",protect, createClient)
route.get("/getClient",protect, getMyClients)
route.get("/getDashboardData",protect, getDashboardData)
route.get("/getClientCount",protect,getClientCount)
route.get("/getSingleClient/:id",protect,getSingleClient)
route.put("/updateClient/:id", protect,updateClient );
route.delete("/deleted/:id",protect,deleteClient)
route.get("/check",protect,checkClientExists)
module.exports=route
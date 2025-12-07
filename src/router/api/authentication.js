const express=require("express")
const { login, register, getMe } = require("../../controller/auth.controller")
const protect = require("../../middlewares/auth.middleware")
const route=express.Router()
route.post("/register",register)
route.post("/login",login)
route.get("/me", protect, getMe);
// route.get("/leadWoner")
module.exports=route
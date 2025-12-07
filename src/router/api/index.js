const express = require("express");
const route = express.Router();

const lead = require("./lead");
const authRoute = require("./authentication");
const client =require("./client")
const externalClinet=require ("./externalClientRoutes.js")
const transaction =require ("./transactionRoutes.js")
const application=require("./applicationRoutes.js")
route.use("/lead", lead);
route.use("/authentication", authRoute);
route.use("/client",client)
route.use("/externalClient",externalClinet)
route.use("/transaction",transaction)
route.use("/application",application)
module.exports = route;

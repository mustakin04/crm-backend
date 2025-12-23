const express = require("express");
const { addExternalClient, getExternalClients, updateExternalClient, deleteExternalClient } = require("../../controller/externalClientController");
const protect = require("../../middlewares/auth.middleware");
const route = express.Router();


// POST → Add External Client
route.post("/addExternalClient",protect, addExternalClient);

// GET → Get All External Clients
route.get("/getExternalClients",protect, getExternalClients);
route.put("/updateExternalClient/:id",protect,updateExternalClient)
route.delete("/deleteExternalClient/:id",protect,deleteExternalClient)
module.exports = route;

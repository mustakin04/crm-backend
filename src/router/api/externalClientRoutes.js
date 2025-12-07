const express = require("express");
const { addExternalClient, getExternalClients } = require("../../controller/externalClientController");
const protect = require("../../middlewares/auth.middleware");
const router = express.Router();


// POST → Add External Client
router.post("/addExternalClient",protect, addExternalClient);

// GET → Get All External Clients
router.get("/getExternalClients",protect, getExternalClients);

module.exports = router;

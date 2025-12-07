const ExternalClient = require("../models/ExternalClient");


// ➤ Add External Client
exports.addExternalClient = async (req, res) => {
  try {
    const newClient = await ExternalClient.create({
      ...req.body,
      createdBy: req.user?._id || null,
    });

    res.status(201).json(newClient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add external client" });
  }
};

// ➤ Get All External Clients
exports.getExternalClients = async (req, res) => {
  try {
    const clients = await ExternalClient.find().sort({ createdAt: -1 });
    const count= await ExternalClient.countDocuments()
    res.status(200).json({clients,count});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch external clients" });
  }
};

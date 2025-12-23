const ExternalClient = require("../models/ExternalClient");

/* ==============================
   ➤ Create External Client
================================ */
exports.addExternalClient = async (req, res) => {
  try {
    const client = await ExternalClient.create({
      ...req.body,
      createdBy: req.user._id, // 🔥 user specific
    });

    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ==============================
   ➤ Get My External Clients
================================ */
exports.getExternalClients = async (req, res) => {
  try {
    let clients;

    // Admin → all clients
    if (req.user.role === "admin") {
      clients = await ExternalClient.find()
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 });
    } 
    // Normal user → only own clients
    else {
      clients = await ExternalClient.find({
        createdBy: req.user._id,
      })
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 });
    }

    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ==============================
   ⭐ Get Single External Client
================================ */
exports.getSingleExternalClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await ExternalClient.findById(id).populate(
      "createdBy",
      "name email role"
    );

    if (!client) {
      return res.status(404).json({ message: "External client not found" });
    }

    // ❌ Non-admin access check
    if (
      req.user.role !== "admin" &&
      client.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this client" });
    }

    res.json({ client });
  } catch (err) {
    console.error("Get single external client error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ==============================
   ⭐ Update External Client
================================ */
exports.updateExternalClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const client = await ExternalClient.findById(id);
    if (!client) {
      return res.status(404).json({ message: "External client not found" });
    }

    // ❌ Non-admin can update only own client
    if (
      req.user.role !== "admin" &&
      client.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this client" });
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== "" && updates[key] !== undefined) {
        client[key] = updates[key];
      }
    });

    await client.save();

    res.json({
      message: "External client updated successfully",
      client,
    });
  } catch (err) {
    console.error("Update external client error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ==============================
   ⭐ Delete External Client
================================ */
exports.deleteExternalClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await ExternalClient.findById(id);
    if (!client) {
      return res.status(404).json({ message: "External client not found" });
    }

    // ✅ Only admin can delete
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can delete external clients" });
    }

    await client.deleteOne();

    res.json({ message: "External client deleted successfully" });
  } catch (err) {
    console.error("Delete external client error:", err);
    res.status(500).json({ message: err.message });
  }
};

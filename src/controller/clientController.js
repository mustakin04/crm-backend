const Client= require("../models/Client.model");


// ⭐ Create Client (User-specific)
const createClient = async (req, res) => {
  try {
    console.log("User:", req.user);

    const client = await Client.create({
      ...req.body,
      createdBy: req.user._id, // user je create korbe
    });

    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ⭐ Get My Clients
const getMyClients = async (req, res) => {
  try {
    let clients;

    // Admin -> all clients
    if (req.user.role === "admin") {
      clients = await Client.find().populate("createdBy", "name email role");
    }
    // Normal user -> only own clients
    else {
      clients = await Client.find({ createdBy: req.user._id }).populate(
        "createdBy",
        "name email role"
      );
    }

    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update single client
const updateClient = async (req, res) => {
  try {
    const { id } = req.params; // /api/v1/client/:id
    const updates = req.body;
     console.log(id,"iddd")
    // খুঁজে নাও ক্লায়েন্ট
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // User-specific check (admin না হলে)
    if (req.user.role !== "admin" && client.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this client" });
    }

    // Update
    Object.keys(updates).forEach((key) => {
      client[key] = updates[key];
    });

    await client.save();

    res.json({ message: "Client updated successfully", client });
  } catch (err) {
    console.error("Update client error:", err);
    res.status(500).json({ message: err.message });
  }
};
// ⭐ Get My Clients (Dashboard Data)
const getDashboardData = async (req, res) => {
  try {
    const now = new Date();

    // Today’s starting time (00:00)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    let filter = {};

    // If NOT admin → show only user's clients
    if (req.user.role !== "admin") {
      filter.createdBy = req.user._id;
    }

    // ----------------- Today's Clients -----------------
    const todaysClients = await Client.find({
      ...filter,
      createdAt: { $gte: startOfToday },
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email role");

    // ----------------- Recent Clients (Last 7 days) -----------------
    const recentClients = await Client.find({
      ...filter,
      createdAt: { $gte: sevenDaysAgo },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("createdBy", "name email role");

    res.json({
      todaysClients,
      recentClients,
      todayCount: todaysClients.length,
      recentCount: recentClients.length,
    });
  } catch (err) {
    console.error("Client dashboard error:", err);
    res.status(500).json({ message: "Error loading client dashboard" });
  }
};
const getClientCount = async (req, res) => {
  try {
    let count;

    if (req.user.role === "admin") {
      count = await Client.countDocuments(); // all leads
    } else {
      count = await Client.countDocuments({ createdBy: req.user._id }); // user-specific leads
    }

    res.json({ totalClients: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports={createClient,getMyClients,updateClient,getDashboardData,getClientCount}
const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // keep required to track user
    },

    // Lead Owner
    leadOwner: { type: String, trim: true },

    // Personal Info
    account: { type: String, default: "Atlas Study", trim: true },
    entity: { type: String, trim: true },
    firstName: { type: String, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    dob: { type: Date },
    passport: { type: String, trim: true },
    nationality: { type: String, trim: true },
    civilStatus: { type: String, trim: true },

    // Contact Info
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    emergencyContact: { type: String, trim: true },
    emergencyPhone: { type: String, trim: true },
    currentLocation: { type: String, trim: true },
    address: { type: String, trim: true },
    policeStation: { type: String, trim: true },
    district: { type: String, trim: true },

    // Responsibility & Services
    responsibleType: { type: String, trim: true },
    prefService: { type: String, trim: true },
    firstServicePref: { type: String, trim: true },
    secondServicePref: { type: String, trim: true },
    campaignCode: { type: String, trim: true },

    // Lead Tracking
    stage: { type: String, trim: true },
    type: { type: String, trim: true },
    responsible: { type: String, trim: true },
    refType: { type: String, trim: true },
    referredBy: { type: String, trim: true },
    nextAction: { type: String, trim: true },
    nextActionDate: { type: Date },

    // Additional
    agentPromo: { type: String, trim: true },
    active: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);

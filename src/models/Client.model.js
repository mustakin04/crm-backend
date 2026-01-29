const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    account: { type: String, default: "Atlas Study" },

    entity: { type: String, trim: true },

    firstName: { type: String, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, trim: true },

    dob: { type: String, trim: true },
    passport: { type: String, trim: true },

    nationality: { type: String, trim: true },
    civilStatus: { type: String, trim: true },

    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },

    emergencyContact: { type: String, trim: true },
    emergencyPhone: { type: String, trim: true },

    currentLocation: { type: String, trim: true },
    address: { type: String, trim: true },
    policeStation: { type: String, trim: true },
    district: { type: String, trim: true },

    responsibleType: { type: String, trim: true },

    prefService: { type: String, trim: true },
    stage: { type: String, trim: true },

    type: { type: String, trim: true },

    responsible: { type: String, trim: true },

    refType: { type: String, trim: true },
    referredBy: { type: String, trim: true },

    nextAction: { type: String, trim: true },
    nextActionDate: { type: String, trim: true },

    agentPromo: { type: String, trim: true },

    active: { type: String, trim: true },

    description: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);

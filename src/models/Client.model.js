const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    // old fields from code-1
    name: String,
    email: String,
    phone: String,

    // new extended fields
    account: String,
    entity: String,
    type: String,
    firstName: String,
    lastName: String,
    nationality: String,
    currentLocation: String,
    altName: String,
    dob: String,
    civilStatus: String,
    address: String,
    admin1: String,
    admin2: String,
    altPhone: String,
    prefService: String,
    stage: String,
    respType: String,
    refType: String,
    referredBy: String,
    nextAction: String,
    nextActionDate: String,
    agentPromo: String,
    active: String,
    description: String,

    // required user reference
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);

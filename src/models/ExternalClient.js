const mongoose = require("mongoose");

const ExternalClientSchema = new mongoose.Schema(
  {
    apprenticeGlobal: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    source: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExternalClient", ExternalClientSchema);

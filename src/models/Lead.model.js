const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // keep required to track user
    },

    // New Fields + old ones merged
    leadOwner: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    title: { type: String, trim: true },
    phone: { type: String, trim: true },
    mobile: { type: String, trim: true },
    leadSource: { type: String, default: "" },
    industry: { type: String, trim: true },
    annualRevenue: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    company: { type: String, trim: true },
    leadStatus: { type: String, default: "New" },
    noOfEmployees: { type: String, trim: true },
    rating: { type: String, trim: true },
    skypeId: { type: String, trim: true },
    secondaryEmail: { type: String, lowercase: true, trim: true },
    twitter: { type: String, trim: true },
    street: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    /* ---------------- BASIC INFO ---------------- */
    account: {
      type: String,
      trim: true,
    },

    entity: {
      type: String,
      trim: true,
    },

    branch: {
      type: String,
      trim: true,
    },

    ownership: {
      type: String,
      default: "Own",
      trim: true,
    },

    /* ---------------- APPLICATION DETAILS ---------------- */
    client: {
      type: String,
      trim: true,
    },

    transaction: {
      type: String,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
    },

    stage: {
      type: String,
      enum: ["Open", "Submitted", "Rejected", "Approved"],
      default: "Open",
    },

    type: {
      type: String,
      trim: true,
    },

    /* ---------------- EDUCATION ---------------- */
    location: {
      type: String,
      trim: true,
    },

    university: {
      type: String,
      trim: true,
    },

    course: {
      type: String,
      trim: true,
    },

    intakeDate: {
      type: String, // frontend থেকে string/date আসে
    },

    /* ---------------- META ---------------- */
    priority: {
      type: String,
      enum: ["Normal", "High"],
      default: "Normal",
    },

    dueDate: {
      type: String,
    },

    /* ---------------- RESPONSIBLE ---------------- */
    responsibleType: {
      type: String,
      default: "User",
    },

    responsible: {
      type: String,
      trim: true,
    },
    notes:{
      type:String,
      trim:true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /* ---------------- SYSTEM ---------------- */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);

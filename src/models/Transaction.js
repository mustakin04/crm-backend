const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String },

    /* BASIC INFO */
    account: {
      type: String,
     
      default: "Atlas",
    },

    entity: {
      type: String,
    },

    branch: { type: String },

    ownership: {
      type: String,
      default: "Own",
    },

    client: {
      type: String, // student id / name
     
    },

    title: {
      type: String,
   
    },

    /* SERVICE INFO */
    type: {
      type: String, // Visa, Enrollment, IELTS etc
    
    },

    subtype: { type: String },

    applicantType: { type: String },

    destination: { type: String },

    university: { type: String },

    courses: { type: String },

    /* PAYMENT INFO */
    totalFee: {
      type: Number,
      default: 0,
    },

    paid: {
      type: Number,
      default: 0,
    },

    due: {
      type: Number,
      default: 0,
    },

    /* RESPONSIBILITY */
    responsibleType: {
      type: String,
      enum: ["User", "Team"],
      default: "User",
    },

    responsible: {
      type: String,
      default: "Atlas Account",
    },

    hasSecondaryResponsible: {
      type: Boolean,
      default: false,
    },

    /* FOLLOW UP */
    nextAction: {
      type: String,
      enum: ["Call", "Email", ""],
    },

    nextActionDate: { type: Date },

    /* STATUS */
    stage: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },

    isReference: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    description: { type: String },

    /* SYSTEM */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);

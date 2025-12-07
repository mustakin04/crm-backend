const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String },
    clientName: { type: String },
    service: { type: String },
    totalFee: { type: Number },
    paid: { type: Number },
    due: { type: Number },
    paymentDate: { type: Date },
    paymentMethod: { type: String },

    apprenticeGlobal: { type: String },
    account: { type: String },
    entity: { type: String },
    branch: { type: String },
    ownership: { type: String },
    title: { type: String },
    visaType: { type: String },
    subtype: { type: String },
    applicantType: { type: String },
    destination: { type: String },
    university: { type: String },
    course: { type: String },

    responsibleType: { type: String },
    responsible: { type: String },
    hasSecondaryResponsible: { type: Boolean, default: false },

    nextAction: { type: String },
    nextActionDate: { type: Date },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // Basic / General Info
    transactionId: { type: String },
    clientName: { type: String },
    client: { type: String },          // old
    service: { type: String },
    title: { type: String },

    // Financial Info
    totalFee: { type: Number },
    paid: { type: Number },
    due: { type: Number },
    paymentDate: { type: String },
    paymentMethod: { type: String },

    // Apprentice / Business Structure
    apprenticeGlobal: { type: String },
    account: { type: String },          // old
    entity: { type: String },           // old
    branch: { type: String },
    ownership: { type: String },        // old

    // Application Details
    type: { type: String },             // old
    visaType: { type: String },
    subtype: { type: String },
    applicantType: { type: String },
    destination: { type: String },

    stage: { type: String },            // old
    location: { type: String },         // old

    university: { type: String },       // old
    course: { type: String },           // old

    intakeDate: { type: String },       // old
    dueDate: { type: String },          // old
    priority: { type: String, default: "Normal" },

    // Responsible Info
    responsibleType: { type: String },  // old
    responsible: { type: String },      // old
    hasSecondaryResponsible: { type: Boolean, default: false },

    // Next Action
    nextAction: { type: String },
    nextActionDate: { type: String },

    // Auto User
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);

const mongoose = require("mongoose");

const ExternalClientSchema = new mongoose.Schema(
  {
    apprenticeGlobal: { type: String },
    firstName: { type: String,  },
    lastName: { type: String,  },
    email: { type: String, },
    phoneNumber: { type: String,  },
    source: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExternalClient", ExternalClientSchema);

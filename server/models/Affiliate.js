const mongoose = require("mongoose");

const AffiliateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    
    contact: { type: String, required: true },
    email: { type: String, required: true },
    adress: { type: String, required: true },
  },
  { timestamps: true }
);

const Affiliate = mongoose.model("affiliate", AffiliateSchema);
module.exports = Affiliate;

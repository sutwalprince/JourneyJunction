const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isAffiliate: { type: Boolean, required: true, default: false },
    avatar: { type: String, required: true },
    address: { type: String, required: false },
    contact: { type: String, required: false },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      
      ref: "hotel",
      required: false,
    },
    hotelown:{type : Boolean ,required :false , default :false},

  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;

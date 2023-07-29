const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotel",
      required: true,
    },
    
    price:{type : int , required: true},
    roomlinks: {type: [ String] ,required: false },
    facilities: { type: [String], required: false },
    description:{type :String , required: false},
    
  },
  { timestamps: true }
);

const Room = mongoose.model("room", RoomSchema);
module.exports = Room;

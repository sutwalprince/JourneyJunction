const mongoose = require("mongoose");                                     

const HotelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },

    hotelimage: { type: String, required: true },
    imagelinks: { type: [String], required: false },
    facilities: { type: [String], required: false },
    address: { type: String, required: true },
    city: { type: String, required: true },

    doubleroom: 
      {
        
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        listed:{type : Boolean ,default:false },
        totalrooms:{type : Number , required: false},
        price: { type: Number, required: false },
        roomlinks: { type: [String], required: false },
        facilities: { type: [String], required: false },
        roomtype:{type : String ,  default:"doubleroom"},
        description: { type: String, required: false },
      },

      trippleroom: 
      {
        
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        totalrooms:{type : Number , required: false},
        listed:{type : Boolean ,default:false },
        price: { type: Number, required: false },
        roomlinks: { type: [String], required: false },
        facilities: { type: [String], required: false },
        roomtype:{type : String ,  default:"trippleroom"},
        description: { type: String, required: false },
      },

      suite: 
      {
        
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        totalrooms:{type : Number , required: false},
        price: { type: Number, required: false },
        listed:{type : Boolean ,default:false },
        roomlinks: { type: [String], required: false },
        facilities: { type: [String], required: false },
        roomtype:{type : String ,  default:"suite"},
        description: { type: String, required: false },
      },
    
  },
  { timestamps: true }
);
HotelSchema.index({ city: 'text' });
const Hotel = mongoose.model("hotel", HotelSchema);
module.exports = Hotel;

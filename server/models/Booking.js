const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },

        numberOfGuests: { type: Number, required: true },
        numberOfRooms: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        startDate: { type: Date, required: true },
        roomimage: { type: String, required: true },
        endDate: { type: Date, required: true },
        roomType: { type: String, required: true },
        hotel: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "hotel",
            required: false,
        },

    },
    { timestamps: true }
);

const Booking = mongoose.model("booking", bookingSchema);
module.exports = Booking;

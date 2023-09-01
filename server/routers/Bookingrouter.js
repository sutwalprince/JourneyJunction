const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authenticate = require("../middlewares/authenticate");
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const sendConfirmationMail = require('./sendConfirmationMail');

// Route to handle booking a hotel
router.post("/", authenticate, async (request, res) => {
  try {
    // Assuming you have received the booking data in the request body
    const {
      hotel, // Hotel ID being booked
      roomType,
      startDate,
      roomimage,
      numberOfRooms,
      endDate,
      numberOfGuests,
      totalPrice,
    } = request.body;
    const user = request.user.id; // User ID making the booking

    // Create a new booking object based on the Booking model
    const newBooking = new Booking({
      user,
      hotel,
      roomType,
      startDate,
      roomimage,
      numberOfRooms,
      endDate,
      numberOfGuests,
      totalPrice,
    });


    // Save the booking to the database
    const savedBooking = await newBooking.save();
    let populatedBooking = await Booking.populate(savedBooking, {
      path: 'user', model: User,
      select: '_id name contact',
    });
    populatedBooking = await Booking.populate(savedBooking, {
      path: 'hotel', model: Hotel,
      select: '_id name contact address email',
    });

    res.status(201).json(populatedBooking);
  } catch (error) {
    // Handle any errors that may occur during booking
    // console.error('Error booking hotel:', error);
    res.status(500).json({ error: 'Error booking hotel. Please try again later.' });
  }
});



router.post("/sendConfirmationMail", authenticate, async (request, response) => {
  try {

    const userId = request.user.id;
    const user = await User.findById(userId);
    const { hotel, checkin, checkout, price, roomtype, guests } = request.body;
    const hotelData = await Hotel.findById(hotel);
    const email = user.email;
    
    // // console.log(randomOTP);
    
    // // console.log(hotel)
    sendConfirmationMail({ recipient_email: email, data: user, hotel: hotelData, checkin: checkin, checkout: checkout, price: price, roomtype: roomtype, guests: guests });
    
    response.status(200).json({
      data: randomOTP
    });
  } catch (error) {

    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});






router.get('/bookings', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all bookings associated with the given user ID
    const bookings = await Booking.find({ user: userId });
    populatedBooking = await Booking.populate(bookings, {
      path: 'hotel', model: Hotel,
      select: '_id name contact address email',
    });
    // Return the bookings as the response
    res.status(200).json(populatedBooking);
  } catch (error) {
    // Handle any errors that may occur during retrieval
    // console.error('Error retrieving bookings:', error);
    res.status(500).json({ error: 'Error retrieving bookings. Please try again later.' });
  }
});




router.delete('/bookings/:bookingId', authenticate, async (req, res) => {
  try {
    // console.log("Ee");
    const bookingId = req.params.bookingId;

    // Find the booking based on the given booking ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Perform any additional validation here, e.g., check if the booking is within the cancellation window, etc.

    // Delete the booking from the database
    await booking.deleteOne();

    // Return a success message as the response
    res.status(200).json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    // Handle any errors that may occur during cancellation
    // console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Error cancelling booking. Please try again later.' });
  }
});

module.exports = router;

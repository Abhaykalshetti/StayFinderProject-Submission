import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js'; // To check listing availability

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Authenticated users)
const createBooking = asyncHandler(async (req, res) => {
  const { listingId, checkInDate, checkOutDate, numberOfGuests } = req.body;

  if (!listingId || !checkInDate || !checkOutDate || !numberOfGuests) {
    res.status(400);
    throw new Error('Please provide all booking details');
  }

  const listing = await Listing.findById(listingId);

  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }

  // Basic validation: Check if dates are valid
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (checkIn >= checkOut) {
    res.status(400);
    throw new Error('Check-out date must be after check-in date');
  }

  if (checkIn < new Date()) {
    res.status(400);
    throw new Error('Check-in date cannot be in the past');
  }

  // Check for existing bookings that overlap
  const overlappingBookings = await Booking.find({
    listing: listingId,
    $or: [
      {
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn },
      },
    ],
    status: { $in: ['pending', 'confirmed'] }, // Only consider active bookings
  });

  if (overlappingBookings.length > 0) {
    res.status(400);
    throw new Error('Selected dates are not available for this listing.');
  }

  // Calculate total price
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const diffDays = Math.round(Math.abs((checkOut - checkIn) / oneDay));
  const totalPrice = diffDays * listing.pricePerNight;

  const booking = await Booking.create({
    listing: listingId,
    user: req.user._id, // The authenticated user is making the booking
    checkInDate,
    checkOutDate,
    numberOfGuests,
    totalPrice,
    status: 'pending', // Initial status
  });

  res.status(201).json(booking);
});

// @desc    Get bookings for the authenticated user
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('listing', 'title location images pricePerNight') // Populate listing details
    .sort({ createdAt: -1 });

  res.json(bookings);
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private (Admin only)
const getAllBookings = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view all bookings');
  }
  const bookings = await Booking.find({})
    .populate('user', 'username email')
    .populate('listing', 'title location');

  res.json(bookings);
});

// @desc    Update booking status (e.g., confirm, cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private (Host of listing or Admin)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id).populate('listing');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const isHost = booking.listing.host.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isHost && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this booking status');
  }

  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status provided');
  }

  booking.status = status;
  const updatedBooking = await booking.save();
  res.json(updatedBooking);
});


export  {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus
};
import asyncHandler  from 'express-async-handler';
import Listing  from '../models/Listing.js';
import  User from '../models/User.js'; // To populate host details

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
// In backend/controllers/listingController.js

const getListings = asyncHandler(async (req, res) => {
  const { location, minPrice, maxPrice, checkInDate, checkOutDate } = req.query;
  let query = {};

  if (location) {
    query.location = { $regex: location, $options: 'i' }; // Case-insensitive search
  }
  if (minPrice) {
    query.pricePerNight = { ...query.pricePerNight, $gte: parseFloat(minPrice) };
  }
  if (maxPrice) {
    query.pricePerNight = { ...query.pricePerNight, $lte: parseFloat(maxPrice) };
  }

  // --- Date availability logic (more complex, simplified here) ---
  if (checkInDate && checkOutDate) {
    const bookings = await Booking.find({
      $or: [
        { checkInDate: { $lt: new Date(checkOutDate) }, checkOutDate: { $gt: new Date(checkInDate) } },
      ],
      status: { $in: ['pending', 'confirmed'] },
    }).select('listing');

    const bookedListingIds = bookings.map(b => b.listing);

    query._id = { $nin: bookedListingIds }; // Exclude listings that are booked during this period
  }
  // --- End Date availability logic ---

  const listings = await Listing.find(query).populate('host', 'username email');
  res.json(listings);
});

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('host', 'username email');

  if (listing) {
    res.json(listing);
  } else {
    res.status(404);
    throw new Error('Listing not found');
  }
});

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private (Host only)
const createListing = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    location,
    pricePerNight,
    images,
    amenities,
    guests,
    bedrooms,
    beds,
    bathrooms,
  } = req.body;

  // req.user is set by authMiddleware.
  // Ensure the user creating the listing is a host.
  if (req.user.role !== 'host' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to create a listing. Only hosts or admins can.');
  }

  const listing = await Listing.create({
    host: req.user._id, // Assign the current user as the host
    title,
    description,
    location,
    pricePerNight,
    images,
    amenities,
    guests,
    bedrooms,
    beds,
    bathrooms,
  });

  res.status(201).json(listing);
});

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private (Host who owns the listing or Admin)
const updateListing = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    location,
    pricePerNight,
    images,
    amenities,
    guests,
    bedrooms,
    beds,
    bathrooms,
  } = req.body;

  const listing = await Listing.findById(req.params.id);

  if (listing) {
    // Check if the authenticated user is the host of the listing or an admin
    const isOwner = listing.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to update this listing');
    }

    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.location = location || listing.location;
    listing.pricePerNight = pricePerNight || listing.pricePerNight;
    listing.images = images || listing.images;
    listing.amenities = amenities || listing.amenities;
    listing.guests = guests || listing.guests;
    listing.bedrooms = bedrooms || listing.bedrooms;
    listing.beds = beds || listing.beds;
    listing.bathrooms = bathrooms || listing.bathrooms;

    const updatedListing = await listing.save();
    res.json(updatedListing);
  } else {
    res.status(404);
    throw new Error('Listing not found');
  }
});

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private (Host who owns the listing or Admin)
const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (listing) {
    // Check if the authenticated user is the host of the listing or an admin
    const isOwner = listing.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to delete this listing');
    }

    await Listing.deleteOne({ _id: listing._id }); // Use deleteOne for Mongoose 6+
    res.json({ message: 'Listing removed' });
  } else {
    res.status(404);
    throw new Error('Listing not found');
  }
});

export {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
};
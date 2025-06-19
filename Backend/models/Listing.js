import mongoose from 'mongoose';

const listingSchema = mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    amenities: {
      type: [String], // Array of amenities (e.g., 'WiFi', 'Pool')
      default: [],
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    bedrooms: {
      type: Number,
      min: 0,
      default: 1,
    },
    beds: {
      type: Number,
      min: 0,
      default: 1,
    },
    bathrooms: {
      type: Number,
      min: 0,
      default: 1,
    },
    // You could add coordinates for map integration later
    // latitude: { type: Number },
    // longitude: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
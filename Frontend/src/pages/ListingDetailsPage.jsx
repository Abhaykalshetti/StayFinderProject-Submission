import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingDetails } from '../api/listings';
import { createBooking } from '../api/bookings';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import PaymentForm from '../components/PaymentForm';

const ListingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [bookingMessage, setBookingMessage] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentBookingDetails, setCurrentBookingDetails] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListingDetails(id);
        setListing(data);
      } catch (err) {
        console.error('Error fetching listing details:', err);
        setError('Failed to load listing details. It might not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleInitialBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setBookingMessage('Please log in to book this property.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);

    if (inDate >= outDate) {
      setBookingMessage('Check-out date must be after check-in date.');
      return;
    }
    if (inDate < new Date().setHours(0,0,0,0)) {
      setBookingMessage('Check-in date cannot be in the past.');
      return;
    }
    if (numberOfGuests <= 0 || numberOfGuests > listing.guests) {
      setBookingMessage(`Number of guests must be between 1 and ${listing.guests}.`);
      return;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((outDate - inDate) / oneDay));
    const totalPrice = diffDays * listing.pricePerNight;

    setCurrentBookingDetails({
      listingId: listing._id,
      checkInDate,
      checkOutDate,
      numberOfGuests: parseInt(numberOfGuests),
      totalPrice,
    });
    setShowPaymentForm(true);
    setBookingMessage('');
  };

  const handlePaymentSuccess = async (paymentResult) => {
    setBookingMessage('Payment successful! Now creating your booking...');
    try {
      const createdBooking = await createBooking(currentBookingDetails);
      setBookingMessage('Booking confirmed successfully!');
      console.log('Booking created:', createdBooking);
      setShowPaymentForm(false);
      setCheckInDate('');
      setCheckOutDate('');
      setNumberOfGuests(1);
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (err) {
      console.error('Booking creation failed after payment:', err.response?.data?.message || err.message);
      setBookingMessage(`Booking failed after payment: ${err.response?.data?.message || 'Server error'}`);
    }
  };

  const handlePaymentError = (errorMessage) => {
    setBookingMessage(`Payment failed: ${errorMessage}. Please try again.`);
    setShowPaymentForm(false);
  };


  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-lg">{error}</div>;
  }

  if (!listing) {
    return <div className="text-center text-gray-600">Listing not found.</div>;
  }

  // Calculate total price for display
  const oneDay = 24 * 60 * 60 * 1000;
  const inDate = new Date(checkInDate);
  const outDate = new Date(checkOutDate);
  const numDays = (checkInDate && checkOutDate && inDate < outDate)
    ? Math.round(Math.abs((outDate - inDate) / oneDay))
    : 0;
  const estimatedTotalPrice = numDays * listing.pricePerNight;


  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{listing.title}</h1>
      <p className="text-lg text-gray-600 mb-2">{listing.location}</p>
      {listing.images && listing.images.length > 0 && (
        <div className="mb-4">
          <img src={listing.images[0]} alt={listing.title} className="w-full h-96 object-cover rounded-lg" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{listing.description}</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Details</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Guests: {listing.guests}</li>
            <li>Bedrooms: {listing.bedrooms}</li>
            <li>Beds: {listing.beds}</li>
            <li>Bathrooms: {listing.bathrooms}</li>
            <li>Price: ${listing.pricePerNight} / night</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Amenities</h2>
          {listing.amenities && listing.amenities.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {listing.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No specific amenities listed.</p>
          )}
        </div>
      </div>

      {/* Map of the listing location section removed */}

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
        <h2 className="text-2xl font-semibold mb-4">Book This Property</h2>
        {!showPaymentForm ? (
          <form onSubmit={handleInitialBookingSubmit} className="space-y-4">
            <div>
              <label htmlFor="checkIn" className="block text-gray-700 font-medium mb-1">Check-in Date</label>
              <input
                type="date"
                id="checkIn"
                className="form-input"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label htmlFor="checkOut" className="block text-gray-700 font-medium mb-1">Check-out Date</label>
              <input
                type="date"
                id="checkOut"
                className="form-input"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label htmlFor="guests" className="block text-gray-700 font-medium mb-1">Number of Guests</label>
              <input
                  type="number"
                  id="guests"
                  className="form-input"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                  min="1"
                  max={listing.guests}
                  required
              />
            </div>
            {estimatedTotalPrice > 0 && (
              <p className="text-lg font-bold text-gray-800">
                Estimated Total: ${estimatedTotalPrice.toFixed(2)}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
            >
              Proceed to Payment
            </button>
          </form>
        ) : (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-3">Confirm Payment</h3>
            {currentBookingDetails && (
              <PaymentForm
                bookingDetails={currentBookingDetails}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            )}
            <button
              onClick={() => setShowPaymentForm(false)}
              className="mt-4 w-full bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 transition duration-200"
            >
              Go Back to Booking Details
            </button>
          </div>
        )}
        {bookingMessage && (
          <p className={`mt-4 text-center ${bookingMessage.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
            {bookingMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ListingDetailsPage;
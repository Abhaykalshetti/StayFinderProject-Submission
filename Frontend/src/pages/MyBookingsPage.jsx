import React, { useEffect, useState } from 'react';
import { getMyBookings, updateBookingStatus } from '../api/bookings.jsx';
import Spinner from '../components/Spinner';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await updateBookingStatus(bookingId, { status: 'cancelled' });
        alert('Booking cancelled successfully!');
        fetchBookings(); // Refresh bookings
      } catch (err) {
        console.error('Error cancelling booking:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Failed to cancel booking.');
      }
    }
  };

  const formatISTDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata', // Set to IST
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-lg">{error}</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">You have no bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold mb-2">
                {booking.listing?.title || 'Unknown Listing'}
              </h3>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Location:</span> {booking.listing?.location || 'N/A'}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Check-in:</span> {formatISTDate(booking.checkInDate)}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Check-out:</span> {formatISTDate(booking.checkOutDate)}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Guests:</span> {booking.numberOfGuests}
              </p>
              <p className="text-xl font-bold text-blue-700 mb-3">
                Total Price: ${booking.totalPrice.toFixed(2)}
              </p>
              <p className={`font-semibold ${
                booking.status === 'confirmed' ? 'text-green-600' :
                booking.status === 'pending' ? 'text-orange-500' :
                'text-red-600'
              }`}>
                Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </p>
              {booking.status === 'pending' && (
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
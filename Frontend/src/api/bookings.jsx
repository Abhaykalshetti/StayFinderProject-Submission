import API from './axiosConfig';

export const createBooking = async (bookingData) => {
  const response = await API.post('/bookings', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await API.get('/bookings/mybookings');
  return response.data;
};

export const getAllBookings = async () => {
  // Admin-only route
  const response = await API.get('/bookings');
  return response.data;
};

export const updateBookingStatus = async (id, statusData) => {
  const response = await API.put(`/bookings/${id}/status`, statusData);
  return response.data;
};
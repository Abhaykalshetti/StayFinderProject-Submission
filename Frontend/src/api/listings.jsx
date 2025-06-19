import API from './axiosConfig';

export const getAllListings = async (filters = {}) => { // Accept filters object
  const params = new URLSearchParams(filters).toString(); // Convert filters to query string
  const response = await API.get(`/listings?${params}`);
  return response.data;
};

export const getListingDetails = async (id) => {
  const response = await API.get(`/listings/${id}`);
  return response.data;
};

export const createListing = async (listingData) => {
  const response = await API.post('/listings', listingData);
  return response.data;
};

export const updateListing = async (id, listingData) => {
  const response = await API.put(`/listings/${id}`, listingData);
  return response.data;
};

export const deleteListing = async (id) => {
  const response = await API.delete(`/listings/${id}`);
  return response.data;
};
import React, { useEffect, useState } from 'react';
import { createListing, getAllListings, updateListing, deleteListing } from '../api/listings.jsx';
import { useAuth } from '../context/authContext.jsx';
import Spinner from '../components/Spinner.jsx';

const HostDashboardPage = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);

  // Form states for new/edit listing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [images, setImages] = useState([]); // Array of strings (URLs)
  const [amenities, setAmenities] = useState([]); // Array of strings
  const [guests, setGuests] = useState(1);
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);

  useEffect(() => {
    fetchHostListings();
  }, [user]); // Re-fetch if user changes (though usually set once)

  const fetchHostListings = async () => {
    if (!user) return; // Don't fetch if no user is logged in
    setLoading(true);
    setError(null);
    try {
      const allListings = await getAllListings();
      // Filter listings by the current authenticated host's ID
      const filteredListings = allListings.filter(listing => listing.host && listing.host._id === user._id);
      setMyListings(filteredListings);
    } catch (err) {
      console.error('Error fetching host listings:', err);
      setError('Failed to load your listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setPricePerNight('');
    setImages([]);
    setAmenities([]);
    setGuests(1);
    setBedrooms(1);
    setBeds(1);
    setBathrooms(1);
    setIsEditing(false);
    setCurrentListing(null);
  };

  const handleCreateOrUpdateListing = async (e) => {
    e.preventDefault();
    setError(null);

    const listingData = {
      title,
      description,
      location,
      pricePerNight: parseFloat(pricePerNight),
      images,
      amenities,
      guests: parseInt(guests),
      bedrooms: parseInt(bedrooms),
      beds: parseInt(beds),
      bathrooms: parseInt(bathrooms),
    };

    try {
      if (isEditing && currentListing) {
        await updateListing(currentListing._id, listingData);
        alert('Listing updated successfully!');
      } else {
        await createListing(listingData);
        alert('Listing created successfully!');
      }
      resetForm();
      fetchHostListings(); // Refresh listings
    } catch (err) {
      console.error('Error saving listing:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to save listing.');
    }
  };

  const handleEditClick = (listing) => {
    setIsEditing(true);
    setCurrentListing(listing);
    setTitle(listing.title);
    setDescription(listing.description);
    setLocation(listing.location);
    setPricePerNight(listing.pricePerNight);
    setImages(listing.images);
    setAmenities(listing.amenities);
    setGuests(listing.guests);
    setBedrooms(listing.bedrooms);
    setBeds(listing.beds);
    setBathrooms(listing.bathrooms);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setError(null);
      try {
        await deleteListing(id);
        alert('Listing deleted successfully!');
        fetchHostListings(); // Refresh listings
      } catch (err) {
        console.error('Error deleting listing:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Failed to delete listing.');
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-lg">{error}</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Host Dashboard</h1>

      {/* Listing Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Listing' : 'Create New Listing'}</h2>
        <form onSubmit={handleCreateOrUpdateListing} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Title</label>
            <input type="text" id="title" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea id="description" rows="4" className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-700 font-medium mb-1">Location</label>
            <input type="text" id="location" className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="pricePerNight" className="block text-gray-700 font-medium mb-1">Price per Night ($)</label>
            <input type="number" id="pricePerNight" className="form-input" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} min="0" required />
          </div>
          <div>
            <label htmlFor="images" className="block text-gray-700 font-medium mb-1">Image URLs (comma-separated)</label>
            <input type="text" id="images" className="form-input" value={images.join(',')} onChange={(e) => setImages(e.target.value.split(',').map(img => img.trim()))} placeholder="e.g., url1,url2" />
          </div>
          <div>
            <label htmlFor="amenities" className="block text-gray-700 font-medium mb-1">Amenities (comma-separated)</label>
            <input type="text" id="amenities" className="form-input" value={amenities.join(',')} onChange={(e) => setAmenities(e.target.value.split(',').map(amenity => amenity.trim()))} placeholder="e.g., WiFi,Pool" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="guests" className="block text-gray-700 font-medium mb-1">Guests</label>
              <input type="number" id="guests" className="form-input" value={guests} onChange={(e) => setGuests(e.target.value)} min="1" required />
            </div>
            <div>
              <label htmlFor="bedrooms" className="block text-gray-700 font-medium mb-1">Bedrooms</label>
              <input type="number" id="bedrooms" className="form-input" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} min="0" />
            </div>
            <div>
              <label htmlFor="beds" className="block text-gray-700 font-medium mb-1">Beds</label>
              <input type="number" id="beds" className="form-input" value={beds} onChange={(e) => setBeds(e.target.value)} min="0" />
            </div>
            <div>
              <label htmlFor="bathrooms" className="block text-gray-700 font-medium mb-1">Bathrooms</label>
              <input type="number" id="bathrooms" className="form-input" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} min="0" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition duration-200"
            >
              {isEditing ? 'Update Listing' : 'Create Listing'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-600 transition duration-200"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Your Listings */}
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">Your Listings</h2>
      {myListings.length === 0 ? (
        <p className="text-center text-gray-600">You haven't listed any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={listing.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
                <p className="text-xl font-bold text-blue-700">${listing.pricePerNight} / night</p>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEditClick(listing)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(listing._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostDashboardPage;
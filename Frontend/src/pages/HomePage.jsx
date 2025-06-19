import React, { useEffect, useState } from 'react';
import { getAllListings } from '../api/listings';
import PropertyCard from '../components/PropertyCard';
import Spinner from '../components/Spinner';
import SearchBar from '../components/SearchBar';

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchListings(filters);
  }, [filters]);

  const fetchListings = async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllListings(currentFilters);
      setListings(data);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-lg">{error}</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Find Your Next Stay</h1>

      <SearchBar onSearch={handleSearch} />

      {/* Map View section removed */}

      <h2 className="text-3xl font-bold mb-6 text-blue-700">Available Properties</h2>
      {listings.length === 0 ? (
        <p className="text-center text-gray-600">No properties found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <PropertyCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
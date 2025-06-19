import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ listing }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/listings/${listing._id}`}>
        <img
          src={listing.images[0] || 'https://via.placeholder.com/400x250?text=No+Image'}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">
          <Link to={`/listings/${listing._id}`} className="hover:text-blue-600">
            {listing.title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
        <p className="text-xl font-bold text-blue-700">
          ${listing.pricePerNight} <span className="text-base font-normal text-gray-500">/ night</span>
        </p>
      </div>
    </div>
  );
};

export default PropertyCard;
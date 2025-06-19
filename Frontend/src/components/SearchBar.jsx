import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import datepicker styles

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      location,
      minPrice,
      maxPrice,
      checkInDate: checkInDate ? checkInDate.toISOString().split('T')[0] : '', // YYYY-MM-DD
      checkOutDate: checkOutDate ? checkOutDate.toISOString().split('T')[0] : '', // YYYY-MM-DD
    });
  };

  const clearFilters = () => {
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setCheckInDate(null);
    setCheckOutDate(null);
    onSearch({}); // Reset search results
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label htmlFor="location" className="block text-gray-700 font-medium mb-1">Location</label>
        <input
          type="text"
          id="location"
          placeholder="e.g., New York"
          className="form-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="minPrice" className="block text-gray-700 font-medium mb-1">Min Price</label>
        <input
          type="number"
          id="minPrice"
          placeholder="$ Min"
          className="form-input"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          min="0"
        />
      </div>
      <div>
        <label htmlFor="maxPrice" className="block text-gray-700 font-medium mb-1">Max Price</label>
        <input
          type="number"
          id="maxPrice"
          placeholder="$ Max"
          className="form-input"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          min="0"
        />
      </div>
      <div>
        <label htmlFor="checkIn" className="block text-gray-700 font-medium mb-1">Check-in Date</label>
        <DatePicker
          selected={checkInDate}
          onChange={(date) => setCheckInDate(date)}
          selectsStart
          startDate={checkInDate}
          endDate={checkOutDate}
          minDate={new Date()} // Can't select past dates
          placeholderText="Select check-in"
          className="form-input w-full"
          dateFormat="yyyy/MM/dd"
        />
      </div>
      <div>
        <label htmlFor="checkOut" className="block text-gray-700 font-medium mb-1">Check-out Date</label>
        <DatePicker
          selected={checkOutDate}
          onChange={(date) => setCheckOutDate(date)}
          selectsEnd
          startDate={checkInDate}
          endDate={checkOutDate}
          minDate={checkInDate || new Date()} // Cannot be before check-in or today
          placeholderText="Select check-out"
          className="form-input w-full"
          dateFormat="yyyy/MM/dd"
        />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end space-x-2">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
        >
          Search
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="bg-gray-400 text-white py-2 px-6 rounded-md font-semibold hover:bg-gray-500 transition duration-200"
        >
          Clear Filters
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
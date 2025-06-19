import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, signOut, checkUserRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          StayFinder
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-gray-200">
              Home
            </Link>
          </li>
          {user ? (
            <>
              {checkUserRole(['host', 'admin']) && (
                <li>
                  <Link to="/host/dashboard" className="hover:text-gray-200">
                    Host Dashboard
                  </Link>
                </li>
              )}
              {checkUserRole(['guest', 'host', 'admin']) && (
                <li>
                  <Link to="/my-bookings" className="hover:text-gray-200">
                    My Bookings
                  </Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-200">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-200">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
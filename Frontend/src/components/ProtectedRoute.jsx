import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import Spinner from './Spinner.jsx'; // Optional: for loading state

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, checkUserRole } = useAuth();

  if (loading) {
    return <Spinner />; // Or a simple "Loading..." text
  }

  if (!user) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !checkUserRole(allowedRoles)) {
    // User authenticated but not authorized, redirect to home or a forbidden page
    alert('You do not have permission to access this page.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
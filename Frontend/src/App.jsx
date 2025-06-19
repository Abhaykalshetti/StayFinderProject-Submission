import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ListingDetailsPage from './pages/ListingDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HostDashboardPage from './pages/HostDashboardPage';
import MyBookingsPage from './pages/MyBookingsPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Stripe integration remains
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from './config';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto p-4">
            <Elements stripe={stripePromise}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/listings/:id" element={<ListingDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/host/dashboard"
                  element={<ProtectedRoute allowedRoles={['host', 'admin']}><HostDashboardPage /></ProtectedRoute>}
                />
                <Route
                  path="/my-bookings"
                  element={<ProtectedRoute allowedRoles={['guest', 'host', 'admin']}><MyBookingsPage /></ProtectedRoute>}
                />
              </Routes>
            </Elements>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
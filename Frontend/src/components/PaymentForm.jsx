import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { processMockPayment } from '../api/payment'; // Your mock payment API

const PaymentForm = ({ onPaymentSuccess, onPaymentError, bookingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setPaymentError(null);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // In a real Stripe integration, you would typically:
    // 1. Send amount/currency to your backend.
    // 2. Backend creates a PaymentIntent and sends back its client_secret.
    // 3. Frontend uses stripe.confirmCardPayment with the client_secret and cardElement.

    // For this mock payment:
    try {
      const result = await processMockPayment({
        amount: bookingDetails.totalPrice,
        currency: 'usd', // Or 'inr' if applicable for your mock
        description: `Booking for ${bookingDetails.listingId}`,
        // Additional card details would go here if not using CardElement directly for mock
      });

      if (result.success) {
        onPaymentSuccess(result);
      } else {
        setPaymentError(result.message || 'Payment failed.');
        onPaymentError(result.message || 'Payment failed.');
      }
    } catch (err) {
      setPaymentError(err.message || 'An unexpected error occurred during payment.');
      onPaymentError(err.message || 'An unexpected error occurred during payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
        <label className="block text-gray-700 text-sm font-medium mb-2">Card Details</label>
        <CardElement options={cardElementOptions} />
      </div>
      {paymentError && (
        <div className="text-red-600 text-sm text-center">{paymentError}</div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay $${bookingDetails.totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
};

export default PaymentForm;
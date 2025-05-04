
import { Pi } from '@pinetwork-js/sdk';

// Initialize Pi SDK
export const initPiSDK = () => {
  Pi.init({
    version: 'v2',
    sandbox: process.env.NODE_ENV !== 'production' // Use sandbox mode for development
  });
};

// Authenticate user
export const authenticateUser = async () => {
  try {
    const scopes = ['payments', 'username'];
    const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
    console.log('Authentication successful:', auth);
    return auth;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

// Handle incomplete payments
const onIncompletePaymentFound = (payment: any) => {
  console.log('Incomplete payment found:', payment);
  // Handle incomplete payment
};

// Create a new payment
export const createPayment = async (amount: number, memo: string) => {
  try {
    const payment = await Pi.createPayment({
      amount: amount.toString(),
      memo,
      metadata: { orderId: Date.now().toString() }
    });
    console.log('Payment created:', payment);
    return payment;
  } catch (error) {
    console.error('Error creating payment:', error);
    return null;
  }
};

// Complete payment
export const completePayment = async (paymentId: string) => {
  try {
    const payment = await Pi.completePayment(paymentId);
    console.log('Payment completed:', payment);
    return payment;
  } catch (error) {
    console.error('Error completing payment:', error);
    return null;
  }
};

// Cancel payment
export const cancelPayment = async (paymentId: string, reason: string) => {
  try {
    const cancelled = await Pi.cancelPayment(paymentId, reason);
    console.log('Payment cancelled:', cancelled);
    return cancelled;
  } catch (error) {
    console.error('Error cancelling payment:', error);
    return null;
  }
};

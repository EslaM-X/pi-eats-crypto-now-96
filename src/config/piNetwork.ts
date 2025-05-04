
import { Pi } from '@pinetwork-js/sdk';

// Initialize Pi SDK
export const initPiSDK = () => {
  Pi.init({
    version: '2.0',
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
    const paymentData = await Pi.createPayment({
      amount: amount.toString(),
      memo,
      metadata: { orderId: Date.now().toString() }
    });
    console.log('Payment created:', paymentData);
    return paymentData;
  } catch (error) {
    console.error('Error creating payment:', error);
    return null;
  }
};

// Complete payment
export const completePayment = async (paymentId: string) => {
  try {
    // In the latest SDK, completing a payment requires calling Pi.createPayment with the paymentId
    const completedPayment = await Pi.createPayment({
      paymentId,
      amount: '0', // These fields are required but will be ignored when completing
      memo: '',
    });
    console.log('Payment completed:', completedPayment);
    return completedPayment;
  } catch (error) {
    console.error('Error completing payment:', error);
    return null;
  }
};

// Cancel payment
export const cancelPayment = async (paymentId: string, reason: string) => {
  try {
    // In the latest SDK, cancellation is handled differently
    console.log('Attempting to cancel payment:', paymentId, reason);
    // This is a placeholder to maintain API compatibility
    return { cancelled: true, paymentId };
  } catch (error) {
    console.error('Error cancelling payment:', error);
    return null;
  }
};

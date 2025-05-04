
/**
 * Pi Network SDK Configuration and Helper Functions
 * This file provides integration with Pi Network's SDK
 */

// Define the SDK interfaces and types
interface PaymentData {
  identifier?: string;
  paymentId?: string;
  _id?: string;
  status?: string;
  amount: number;
  memo: string;
  [key: string]: any;
}

// Check if Pi SDK is available in the browser environment
const isPiAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).Pi !== 'undefined';
};

// Create a payment transaction
export const createPayment = async (amount: number, memo: string): Promise<PaymentData | null> => {
  try {
    if (!isPiAvailable()) {
      console.error('Pi SDK not available. Are you using the Pi Browser?');
      throw new Error('Pi SDK not available');
    }

    // Call Pi.createPayment method
    const payment = await (window as any).Pi.createPayment({
      amount: amount,
      memo: memo,
      metadata: { orderId: `order-${Date.now()}` }
    });

    console.log('Payment created:', payment);
    return payment;
  } catch (error: any) {
    console.error('Error creating payment:', error.message);
    return null;
  }
};

// Complete a payment transaction
export const completePayment = async (paymentId: string): Promise<PaymentData | null> => {
  try {
    if (!isPiAvailable()) {
      console.error('Pi SDK not available. Are you using the Pi Browser?');
      throw new Error('Pi SDK not available');
    }

    // Call Pi.completePayment method
    const payment = await (window as any).Pi.completePayment(paymentId);
    console.log('Payment completed:', payment);
    return payment;
  } catch (error: any) {
    console.error('Error completing payment:', error.message);
    return null;
  }
};

// Authenticate user with Pi Network
export const authenticateWithPi = async (): Promise<any> => {
  try {
    if (!isPiAvailable()) {
      console.error('Pi SDK not available. Are you using the Pi Browser?');
      throw new Error('Pi SDK not available');
    }

    // Call Pi.authenticate method
    const auth = await (window as any).Pi.authenticate(
      ['username', 'payments', 'wallet_address'], 
      onIncompletePaymentFound
    );
    
    console.log('Pi authentication result:', auth);
    return auth;
  } catch (error: any) {
    console.error('Pi authentication error:', error.message);
    return null;
  }
};

// Handle incomplete payments
const onIncompletePaymentFound = (payment: PaymentData) => {
  console.log('Incomplete payment found:', payment);
  // You can implement custom logic to handle incomplete payments here
  return completePayment(payment.identifier || payment.paymentId || payment._id || '');
};

export default {
  createPayment,
  completePayment,
  authenticateWithPi
};

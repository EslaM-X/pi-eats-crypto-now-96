
// Pi Network SDK service
// استنادًا إلى الوثائق الرسمية: https://github.com/pi-apps/pi-platform-docs

// تعريف أنواع البيانات
export interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
  uid?: string;
}

declare global {
  interface Window {
    Pi?: {
      init: (options: { version: string, sandbox: boolean }) => void;
      authenticate: (scopes: string[], onSuccess: (authResult: any) => void, onError?: (error: Error) => void) => void;
      createPayment: (paymentData: PiPaymentData, onSuccess: (payment: any) => void, onError?: (error: Error) => void) => any;
      openPayment: (paymentId: string, onSuccess: (payment: any) => void, onError?: (error: Error) => void) => void;
      user: { uid: string; username: string };
    };
  }
}

// تهيئة SDK
export function initPiNetwork(options = { sandbox: false }) {
  try {
    if (typeof window.Pi === 'undefined') {
      console.error('Pi SDK is not loaded. Make sure the Pi SDK script is included in your HTML.');
      return false;
    }

    window.Pi.init({ version: "2.0", sandbox: options.sandbox });
    console.log('Pi Network SDK initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Pi Network SDK:', error);
    return false;
  }
}

// مصادقة المستخدم
export async function authenticate(): Promise<PiUser | null> {
  return new Promise((resolve) => {
    try {
      if (typeof window.Pi === 'undefined') {
        console.error('Pi SDK is not loaded');
        resolve(null);
        return;
      }

      // الأذونات المطلوبة - يمكن تعديلها حسب احتياجات التطبيق
      const scopes = ['username', 'payments', 'wallet_address'];

      window.Pi.authenticate(scopes, 
        (authResult) => {
          console.log('Pi Authentication successful:', authResult);
          
          // إذا نجحت عملية المصادقة، نقوم بإرجاع بيانات المستخدم
          if (authResult.user) {
            const piUser: PiUser = {
              uid: authResult.user.uid,
              username: authResult.user.username,
              accessToken: authResult.accessToken
            };
            resolve(piUser);
          } else {
            resolve(null);
          }
        },
        (error) => {
          console.error('Pi Authentication error:', error);
          resolve(null);
        }
      );
    } catch (error) {
      console.error('Pi Authentication exception:', error);
      resolve(null);
    }
  });
}

// إنشاء معاملة دفع جديدة
export async function createPayment(amount: number, memo: string, metadata?: Record<string, any>): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window.Pi === 'undefined') {
        reject(new Error('Pi SDK is not loaded'));
        return;
      }

      const paymentData: PiPaymentData = {
        amount,
        memo,
        metadata
      };

      window.Pi.createPayment(
        paymentData,
        (payment) => {
          console.log('Payment created:', payment);
          resolve(payment);
        },
        (error) => {
          console.error('Create payment error:', error);
          reject(error);
        }
      );
    } catch (error) {
      console.error('Create payment exception:', error);
      reject(error);
    }
  });
}

// إكمال معاملة دفع
export async function completePayment(paymentId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window.Pi === 'undefined') {
        reject(new Error('Pi SDK is not loaded'));
        return;
      }

      window.Pi.openPayment(
        paymentId,
        (payment) => {
          console.log('Payment completed:', payment);
          resolve(payment);
        },
        (error) => {
          console.error('Complete payment error:', error);
          reject(error);
        }
      );
    } catch (error) {
      console.error('Complete payment exception:', error);
      reject(error);
    }
  });
}

// تحقق مما إذا كان التطبيق يعمل داخل متصفح Pi
export function isRunningInPiBrowser(): boolean {
  return typeof window.Pi !== 'undefined';
}

export default {
  initPiNetwork,
  authenticate,
  createPayment,
  completePayment,
  isRunningInPiBrowser
};

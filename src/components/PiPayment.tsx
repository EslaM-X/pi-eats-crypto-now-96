
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { createPayment, completePayment } from '@/config/piNetwork';
import { toast } from 'sonner';
import { Loader, CheckCircle, XCircle } from 'lucide-react';
import PiNetworkLogo from './PiNetworkLogo';

interface PiPaymentProps {
  amount: number;
  memo?: string;
  onSuccess: (payment: any) => void;
  onError: (error: string) => void;
}

const PiPayment: React.FC<PiPaymentProps> = ({ 
  amount, 
  memo = "طلب طعام", 
  onSuccess, 
  onError 
}) => {
  const { user, login } = usePiAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handlePayment = async () => {
    if (!user) {
      const authResult = await login();
      if (!authResult) {
        onError('فشل في المصادقة');
        return;
      }
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Create a new payment
      const paymentData = await createPayment(amount, `${memo} - ${amount} Pi`);

      if (!paymentData) {
        throw new Error('فشل في إنشاء الدفعة');
      }

      // Complete the payment
      const completedPayment = await completePayment(paymentData.identifier);

      if (completedPayment && completedPayment.status === 'COMPLETED') {
        setPaymentStatus('success');
        toast.success('تمت عملية الدفع بنجاح!');
        onSuccess(completedPayment);
      } else {
        throw new Error('فشل في إكمال الدفعة');
      }
    } catch (error: any) {
      setPaymentStatus('error');
      toast.error(`خطأ في الدفع: ${error.message}`);
      onError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <PiNetworkLogo size="sm" />
          <span>الدفع باستخدام Pi</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {paymentStatus === 'success' && (
          <div className="flex flex-col items-center justify-center py-4">
            <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
            <p className="text-lg font-bold">تمت عملية الدفع بنجاح!</p>
          </div>
        )}
        
        {paymentStatus === 'error' && (
          <div className="flex flex-col items-center justify-center py-4">
            <XCircle className="h-16 w-16 text-red-500 mb-2" />
            <p className="text-lg font-bold">فشل في إتمام الدفع</p>
            <p className="text-sm text-muted-foreground mt-1">يرجى المحاولة مرة أخرى</p>
          </div>
        )}
        
        {(paymentStatus === 'idle' || paymentStatus === 'processing') && (
          <>
            {user && (
              <p className="mb-4">مرحباً {user.username}!</p>
            )}
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl font-bold">{amount} π</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{memo}</p>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {paymentStatus === 'success' ? (
          <Button variant="outline" onClick={() => setPaymentStatus('idle')}>دفعة جديدة</Button>
        ) : paymentStatus === 'error' ? (
          <Button variant="outline" onClick={() => setPaymentStatus('idle')}>المحاولة مرة أخرى</Button>
        ) : (
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full button-gradient"
          >
            {isProcessing ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                جاري المعالجة...
              </>
            ) : user ? 'ادفع الآن' : 'تسجيل الدخول والدفع'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PiPayment;

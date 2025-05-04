
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import PiPayment from '@/components/PiPayment';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PiPaymentDemo = () => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  
  const handlePaymentSuccess = (payment: any) => {
    console.log('Payment successful:', payment);
    setShowPayment(false);
    // Handle successful payment, e.g., update order status
  };
  
  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Handle payment error
  };
  
  return (
    <>
      <Helmet>
        <title>Pi Payment Demo | Eat-Me-Pi</title>
      </Helmet>
      
      <Header />
      
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-8">Pi Payment Demo</h1>
        
        {!showPayment ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Start a Pi Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Amount (Pi)
                </label>
                <Input 
                  type="number" 
                  min="0.1"
                  step="0.1"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              
              <Button 
                onClick={() => setShowPayment(true)}
                className="w-full button-gradient"
              >
                Continue to Payment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-md mx-auto">
            <PiPayment 
              amount={amount}
              memo="Pi Payment Demo"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowPayment(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default PiPaymentDemo;

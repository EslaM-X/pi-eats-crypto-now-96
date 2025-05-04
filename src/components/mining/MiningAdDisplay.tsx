
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdPlaceholder from './AdPlaceholder';

interface MiningAdDisplayProps {
  showAd: boolean;
  handleAdComplete: () => void;
}

const MiningAdDisplay = ({ showAd, handleAdComplete }: MiningAdDisplayProps) => {
  if (!showAd) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Watch Ad to Claim Reward</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <AdPlaceholder width="300px" height="250px" variant="modal" />
          <Button onClick={handleAdComplete} className="mt-4">
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiningAdDisplay;

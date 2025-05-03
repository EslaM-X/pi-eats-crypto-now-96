
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Pickaxe, Sparkles } from 'lucide-react';

interface MiningAnimationProps {
  onClose: () => void;
}

const MiningAnimation: React.FC<MiningAnimationProps> = ({ onClose }) => {
  const [progress, setProgress] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          setShowParticles(true);
          setTimeout(() => {
            onClose();
          }, 1500);
        }
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-md relative overflow-hidden">
        {showParticles && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="particle-container">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className="particle"
                  style={{
                    '--particle-x': `${Math.random() * 100 - 50}px`,
                    '--particle-y': `${Math.random() * 100 - 50}px`,
                    '--particle-scale': Math.random() * 0.5 + 0.5,
                    '--particle-opacity': Math.random() * 0.7 + 0.3,
                    '--particle-duration': `${Math.random() * 0.5 + 0.5}s`,
                    '--particle-delay': `${Math.random() * 0.2}s`,
                    backgroundColor: Math.random() > 0.5 ? '#9333ea' : '#f97316',
                  } as React.CSSProperties}
                >
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              ))}
            </div>
          </div>
        )}
        <CardContent className="p-10">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className={`h-24 w-24 rounded-full flex items-center justify-center ${
                showParticles 
                  ? 'bg-gradient-to-br from-pi to-orange animate-pulse' 
                  : 'bg-muted'
              }`}>
                <Pickaxe 
                  className={`h-12 w-12 ${
                    showParticles ? 'text-white' : 'text-primary'
                  } ${!showParticles && 'animate-bounce'}`}
                />
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-2">
              {showParticles ? 'Mining Successful!' : 'Mining in Progress...'}
            </h2>
            
            {!showParticles && (
              <>
                <p className="text-muted-foreground mb-4">
                  Processing your mining request. Please wait...
                </p>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pi to-orange transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {progress}% Complete
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiningAnimation;

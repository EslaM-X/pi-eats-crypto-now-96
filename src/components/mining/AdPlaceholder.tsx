
import React from 'react';

interface AdPlaceholderProps {
  width: string;
  height: string;
  text?: string;
  variant?: 'horizontal' | 'vertical' | 'square' | 'modal';
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ 
  width, 
  height, 
  text = 'Advertisement', 
  variant = 'square' 
}) => {
  // Different background gradients based on variant
  const gradients = {
    horizontal: 'bg-gradient-to-r from-pi/10 to-orange/10',
    vertical: 'bg-gradient-to-r from-pi/10 via-orange/10 to-pi/10',
    square: 'bg-gradient-to-br from-pi/10 to-orange/10',
    modal: 'bg-gradient-to-br from-pi/20 via-muted/10 to-orange/20',
  };

  return (
    <div 
      className={`relative ${gradients[variant]} border border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern-light dark:bg-grid-pattern-dark"></div>
      </div>
      <div className="text-center z-10">
        <p className="text-muted-foreground font-medium">{text}</p>
        {variant === 'modal' && (
          <p className="text-muted-foreground/70 text-sm mt-1">Watch this ad to continue mining</p>
        )}
      </div>
    </div>
  );
};

export default AdPlaceholder;

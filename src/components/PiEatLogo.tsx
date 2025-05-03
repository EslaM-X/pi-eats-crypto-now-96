
import React from 'react';

interface PiEatLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showEmoji?: boolean;
}

const PiEatLogo: React.FC<PiEatLogoProps> = ({ 
  size = 'md',
  showEmoji = true
}) => {
  const sizes = {
    sm: "scale-75",
    md: "scale-100",
    lg: "scale-150",
    xl: "scale-200",
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizes[size]}`}>
      <div className="text-4xl font-bold text-foreground">π</div>
      {showEmoji && (
        <div className="absolute -top-2 -right-2 text-xl bg-orange text-white rounded-full h-8 w-8 flex items-center justify-center">
          🍕
        </div>
      )}
    </div>
  );
};

export default PiEatLogo;

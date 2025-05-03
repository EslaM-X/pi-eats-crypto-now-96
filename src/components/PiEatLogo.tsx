
import React from 'react';

interface PiEatLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showEmoji?: boolean;
  className?: string;
}

const PiEatLogo: React.FC<PiEatLogoProps> = ({ 
  size = 'md',
  showEmoji = true,
  className = ''
}) => {
  const sizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl",
    xl: "text-6xl",
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizes[size]} ${className}`}>
      <div className="font-bold text-foreground">π</div>
      {showEmoji && (
        <div className="absolute -top-2 -right-2 text-sm md:text-base bg-orange text-white rounded-full h-5 w-5 md:h-7 md:w-7 flex items-center justify-center">
          🍕
        </div>
      )}
    </div>
  );
};

export default PiEatLogo;

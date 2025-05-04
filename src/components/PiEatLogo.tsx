
import React from 'react';

interface PiEatLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const PiEatLogo: React.FC<PiEatLogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };
  
  return (
    <div className={`font-bold ${sizeClasses[size]} bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent flex items-center`}>
      <span>Pi</span>
      <span className="relative">
        <span>Eat</span>
        <span className="absolute -top-1 -right-2 text-xs bg-orange text-white rounded-full h-3 w-3 flex items-center justify-center">
          🍕
        </span>
      </span>
    </div>
  );
};

export default PiEatLogo;

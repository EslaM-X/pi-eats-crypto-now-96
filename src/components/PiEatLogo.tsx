
import React from 'react';

interface PiEatLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showEmoji?: boolean;
  textOnly?: boolean;
  piOnly?: boolean;
  showEat?: boolean;
}

const PiEatLogo: React.FC<PiEatLogoProps> = ({ 
  size = 'md', 
  className = '', 
  showEmoji = true,
  textOnly = false,
  piOnly = false,
  showEat = true
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };
  
  if (textOnly) {
    return (
      <span className={`font-bold ${sizeClasses[size]} ${className}`}>
        {piOnly ? 'π' : 'πEat'}
      </span>
    );
  }
  
  return (
    <div className={`font-bold ${sizeClasses[size]} bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent flex items-center ${className}`}>
      <span className="relative">
        π
        {showEmoji && (
          <span className="absolute -top-1 -right-2 text-xs bg-orange text-white rounded-full h-3 w-3 flex items-center justify-center">
            🍕
          </span>
        )}
      </span>
      {showEat && <span className="ml-0.5">Eat</span>}
    </div>
  );
};

export default PiEatLogo;


import React from 'react';

interface PiNetworkLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const PiNetworkLogo: React.FC<PiNetworkLogoProps> = ({ 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };

  return (
    <div className={`font-extrabold ${sizeClasses[size]} text-[#8B5CF6] ${className}`}>
      π
    </div>
  );
};

export default PiNetworkLogo;

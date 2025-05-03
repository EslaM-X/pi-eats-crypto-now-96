
import React from 'react';

interface PiNetworkLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const PiNetworkLogo: React.FC<PiNetworkLogoProps> = ({ 
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  return (
    <div className={`flex items-center justify-center ${sizes[size]} ${className}`}>
      <img 
        src="/lovable-uploads/735545db-86b4-4947-9b31-a9a39041b87f.png"
        alt="Pi Network Logo"
        className="rounded-full w-full h-full"
      />
    </div>
  );
};

export default PiNetworkLogo;

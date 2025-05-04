
import React from 'react';
import PiEatLogo from './PiEatLogo';

interface PiNetworkLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const PiNetworkLogo: React.FC<PiNetworkLogoProps> = ({ 
  size = 'md',
  className = ''
}) => {
  // تحسين وضوح رمز π في هذا المكون أيضًا
  return (
    <div className={`pi-symbol ${className}`}>
      <PiEatLogo 
        size={size} 
        className={className} 
        showEat={false} 
        piOnly={true} 
        showEmoji={true}
      />
    </div>
  );
};

export default PiNetworkLogo;

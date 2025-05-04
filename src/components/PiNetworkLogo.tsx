
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
  // Using the PiEatLogo component with piOnly prop to only show the π symbol
  return <PiEatLogo size={size} className={className} showEat={false} />;
};

export default PiNetworkLogo;

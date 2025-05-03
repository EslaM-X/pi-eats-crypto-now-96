
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
  // بدلاً من عرض شعار Pi Network، سنستخدم مكون PiEatLogo
  return <PiEatLogo size={size} className={className} />;
};

export default PiNetworkLogo;

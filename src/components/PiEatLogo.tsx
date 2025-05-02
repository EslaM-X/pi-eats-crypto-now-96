
import React from 'react';

const PiEatLogo: React.FC = () => (
  <div className="relative inline-flex items-center justify-center">
    <div className="text-2xl font-bold">π</div>
    <div className="absolute -top-2 -right-2 text-xs bg-orange text-white rounded-full h-4 w-4 flex items-center justify-center">
      🍕
    </div>
  </div>
);

export default PiEatLogo;

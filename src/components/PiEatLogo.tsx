
import React from 'react';

const PiEatLogo: React.FC = () => (
  <div className="relative inline-flex items-center justify-center scale-125">
    <div className="text-3xl font-bold">π</div>
    <div className="absolute -top-2 -right-2 text-lg bg-orange text-white rounded-full h-6 w-6 flex items-center justify-center">
      🍕
    </div>
  </div>
);

export default PiEatLogo;

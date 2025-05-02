
import React from 'react';

const PiEatLogo: React.FC = () => (
  <div className="relative inline-flex items-center justify-center scale-150">
    <div className="text-4xl font-bold">π</div>
    <div className="absolute -top-2 -right-2 text-xl bg-orange text-white rounded-full h-8 w-8 flex items-center justify-center">
      🍕
    </div>
  </div>
);

export default PiEatLogo;

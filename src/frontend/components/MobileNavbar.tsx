
import React from 'react';
import { Link } from 'react-router-dom';
import PiEatLogo from '../../components/PiEatLogo';

export const MobileNavbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm dark:shadow-gray-800/10 md:hidden py-2 px-4">
      <div className="flex justify-center">
        <Link to="/" className="flex items-center">
          <PiEatLogo style="mining" />
        </Link>
      </div>
    </div>
  );
};

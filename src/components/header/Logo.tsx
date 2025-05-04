
import React from 'react';
import { Link } from 'react-router-dom';
import PiEatLogo from '../PiEatLogo';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <PiEatLogo />
      <span className="text-2xl font-bold bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
        Eat-Me
      </span>
    </Link>
  );
};

export default Logo;

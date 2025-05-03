import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-white font-medium' : 'text-gray-400 hover:text-white';
  };

  return (
    <footer className="bg-black/80 backdrop-blur-sm py-4 sm:py-8 mt-auto border-t border-purple-500/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Game Info */}
          <div className="flex flex-col items-start sm:items-start space-y-3">
            <h3 className="text-white font-bold text-lg sm:text-xl mb-1 tracking-wide">Guess The Number</h3>
            <p className="text-gray-400 text-sm sm:text-base text-start sm:text-left font-light leading-relaxed max-w-xs">
              A fun number guessing game that challenges your logical thinking and number sense.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start sm:items-start space-y-3">
            <h3 className="text-white font-bold text-lg sm:text-xl mb-1 tracking-wide">Quick Links</h3>
            <div className="flex flex-col space-y-2.5">
              <Link 
                to="/home" 
                className={`text-sm sm:text-base transition-colors duration-200 ${isActive('/home')}`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`text-sm sm:text-base transition-colors duration-200 ${isActive('/about')}`}
              >
                About
              </Link>
              <Link 
                to="/leaderboard" 
                className={`text-sm sm:text-base transition-colors duration-200 ${isActive('/leaderboard')}`}
              >
                Leaderboard
              </Link>
            </div>
          </div>

          {/* Game Modes */}
          <div className="flex flex-col items-start sm:items-start space-y-3 sm:col-span-2 md:col-span-1">
            <h3 className="text-white font-bold text-lg sm:text-xl mb-1 tracking-wide">Game Modes</h3>
            <div className="flex flex-col space-y-2.5">
              <span className="text-gray-400 text-sm sm:text-base font-light">Singleplayer</span>
              <span className="text-gray-400 text-sm sm:text-base font-light">Multiplayer</span>
              <span className="text-gray-400 text-sm sm:text-base font-light">Different difficulty levels</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-4 border-t border-purple-500/10 text-center">
          <p className="text-gray-500 text-xs sm:text-sm font-light">
            © {currentYear} Guess The Number. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
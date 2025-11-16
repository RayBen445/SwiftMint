import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold text-primary-600">SwiftMint</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/send"
              className={`font-medium transition-colors ${
                isActive('/send') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Send
            </Link>
            <Link
              to="/request"
              className={`font-medium transition-colors ${
                isActive('/request') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Request
            </Link>
            <Link
              to="/convert"
              className={`font-medium transition-colors ${
                isActive('/convert') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Convert
            </Link>
            <Link
              to="/history"
              className={`font-medium transition-colors ${
                isActive('/history') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              History
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="btn-secondary text-sm">Login</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useStore } from '../store/useStore';
import {jwtDecode} from 'jwt-decode'; // You can use jwt-decode to decode the JWT token

export default function Navbar() {
  const { cart, user, setAuthModalOpen } = useStore();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { isAuthenticated, email, token, setAuth, clearAuth } = useStore();

  useEffect(() => {
    // Check if the user is logged in and if the token exists in localStorage
    const token = localStorage.getItem('token');
console.log(user)
    if (token) {
      try {
        setUserEmail(localStorage.getItem('email')); // Set the user email from decoded token
        console.log(userEmail)
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, []);
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-orange-600">OB Burgers</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/shop" className="text-gray-700 hover:text-orange-600">
              Menu
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-orange-600">
                Dashboard
              </Link>
            )}
             {isAuthenticated && email && (
            <div className="text-gray-700 hover:text-orange-600">
              <span className="font-medium">{email}</span> {/* Display email */}
            </div>
          )}
            <Link to="/checkout" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-orange-600" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Link>
            {!isAuthenticated ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center text-gray-700 hover:text-orange-600"
            >
              <User className="h-6 w-6" />
            </button>
          ) : (
            <button
              onClick={() => {
                clearAuth(); // Clear token and authentication state

              }}
              className="text-gray-700 hover:text-orange-600"
            >
              Logout
            </button>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
}
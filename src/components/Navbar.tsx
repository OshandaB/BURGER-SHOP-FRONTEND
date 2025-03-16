import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useStore } from "../store/useStore";

export default function Navbar() {
  const { cart, isAuthenticated, email, setAuthModalOpen, clearAuth, user } = useStore();
  const totalItems = cart.length;
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle menu function
  const toggleMenu = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click from triggering the document listener
    setMenuOpen((prev) => !prev);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!(event.target as HTMLElement)?.closest(".menu-container")) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-orange-600">OB Burgers</Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/shop" className="text-gray-700 hover:text-orange-600">Menu</Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link to="/admin" className="text-gray-700 hover:text-orange-600">
                Dashboard
              </Link>
            )}
            {isAuthenticated && email && (
              <span className="text-gray-700">{email}</span> 
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
              <button onClick={() => setAuthModalOpen(true)} className="text-gray-700 hover:text-orange-600">
                <User className="h-6 w-6" />
              </button>
            ) : (
              <button onClick={clearAuth} className="text-gray-700 hover:text-orange-600">
                Logout
              </button>
            )}
          </div>

          {/* Hamburger Menu */}
          <button onClick={toggleMenu} className="md:hidden text-gray-700 hover:text-orange-600">
            <Menu className="h-8 w-8" />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden menu-container absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col space-y-4">
            <Link to="/shop" className="text-gray-700 hover:text-orange-600">Menu</Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link to="/admin" className="text-gray-700 hover:text-orange-600">
                Dashboard
              </Link>
            )}
            {isAuthenticated && email && (
              <span className="text-gray-700">{email}</span>
            )}
            <Link to="/checkout" className="relative flex items-center">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-orange-600" />
              {totalItems > 0 && (
                <span className="ml-2 bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Link>
            {!isAuthenticated ? (
              <button onClick={() => setAuthModalOpen(true)} className="text-gray-700 hover:text-orange-600">
                Login
              </button>
            ) : (
              <button onClick={clearAuth} className="text-gray-700 hover:text-orange-600">
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

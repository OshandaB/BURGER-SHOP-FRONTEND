import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Savor the Perfect Burger
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Handcrafted burgers made with premium ingredients
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              Order Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Featured Burgers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`https://images.unsplash.com/photo-155054766${i}-d9450f859349?auto=format&fit=crop&q=80`}
                alt={`Featured burger ${i}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Classic Burger {i}</h3>
                <p className="text-gray-600 mb-4">
                  Delicious beef patty with fresh vegetables and our special sauce
                </p>
                <Link
                  to={`/product/${i}`}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4">
                Founded in 2020, BurgerHub has been serving the finest burgers in
                town. We take pride in using only the freshest ingredients and
                creating unique flavor combinations that keep our customers coming
                back for more.
              </p>
              <p className="text-gray-600">
                Every burger is made to order with love and attention to detail,
                ensuring you get the perfect bite every time.
              </p>
            </div>
            <div className="relative h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80"
                alt="Restaurant interior"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Visit Us Today
          </h2>
          <p className="text-gray-600 mb-8">
            123 Burger Street, Foodie City, FC 12345
            <br />
            Open daily from 11 AM to 10 PM
          </p>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}
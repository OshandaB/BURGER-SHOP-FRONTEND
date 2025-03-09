import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

const products = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheddar cheese, lettuce, tomato, and our special sauce',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80',
    category: 'beef'
  },
  {
    id: '2',
    name: 'Bacon Deluxe',
    description: 'Premium beef patty topped with crispy bacon, caramelized onions, and BBQ sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80',
    category: 'beef'
  },
  {
    id: '3',
    name: 'Mushroom Swiss',
    description: 'Beef patty with sautéed mushrooms, Swiss cheese, and garlic aioli',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&q=80',
    category: 'beef'
  }
];

export default function Shop() {
  const navigate = useNavigate();
  const { addToCart } = useStore();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Menu</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              onClick={() => navigate(`/product/${product.id}`)}
              className="cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                  >
                    Add to Cart
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="inline-flex items-center px-4 py-2 border border-orange-600 text-sm font-medium rounded-md text-orange-600 hover:bg-orange-50"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
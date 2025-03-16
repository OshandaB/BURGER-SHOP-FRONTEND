import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Minus, Plus } from 'lucide-react';
import { Product } from '../types';
import axiosInstance from '../util/axiosInstance';

const product = {
  id: '1',
  name: 'Classic Cheeseburger',
  description: 'Our signature burger features a juicy beef patty made from 100% premium ground beef, topped with melted cheddar cheese, fresh crisp lettuce, ripe tomato slices, and our special house-made sauce. Served on a toasted brioche bun.',
  price: 9.99,
  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80',
  category: 'beef',
  ingredients: ['Beef patty', 'Cheddar cheese', 'Lettuce', 'Tomato', 'Special sauce', 'Brioche bun'],
  nutritionalInfo: {
    calories: 650,
    protein: '35g',
    carbs: '45g',
    fat: '38g'
  }
};

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = React.useState(1);
  const { addToCart } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  // Fetch product details from API

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        const data = response.data;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);
  // Handle loading state
  if (!product) {
    return <div className="text-center py-10 text-gray-600">Loading product...</div>;
  }
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img
            src={`http://localhost:5000/uploads/${product.image}`}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
            <ul className="list-disc list-inside text-gray-600">
              {product.ingredients.split(',').map((ingredient) => (
                <li key={ingredient.trim()}>{ingredient.trim()}</li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Nutritional Information:</h3>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div>Calories: {product.calories}</div>
              <div>Protein: {product.protein}</div>
              <div>Carbs: {product.carbs}</div>
              <div>Fat: {product.fat}</div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-3 px-6 text-white bg-orange-600 hover:bg-orange-700 rounded-md font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
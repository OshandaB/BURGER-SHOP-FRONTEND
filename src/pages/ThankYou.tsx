import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function ThankYou() {
    const { clearCart } = useStore();
  
  useEffect(() => {
    clearCart(); // Clear the cart after successful order

  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 mb-8">
          Your order has been received and is being prepared. You will receive a
          confirmation email shortly with your order details.
        </p>
        <div className="space-y-4">
          <p className="text-gray-600">
            Estimated delivery time: 30-45 minutes
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 text-white bg-orange-600 hover:bg-orange-700 rounded-md font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
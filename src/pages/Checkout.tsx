import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js'; // Stripe integration
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const { cart, loadCart, removeFromCart, updateQuantity, clearCart, addToCart } = useStore();
  const navigate = useNavigate();
  const { user } = useStore();

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  useEffect(() => {
    loadCart();
  }, []);
  
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      userId: user?.email || null, // Replace with actual user ID if available
      items: cart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      })),
      total,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: formData.address,
      status: 'pending', // Default status
    };
  
    // Handle order submission here
    try {
      const response = await axios.post('http://localhost:5000/api/v1/orders', orderData);
  
      if (response.status === 201) {
        console.log('Order successfully placed:', response.data);
        clearCart(); // Clear the cart after successful order
        // navigate('/thank-you');
      }    
      console.log('Order submitted:', { cart, formData, total });

    } catch (error:any) {
      console.error('Error placing order:', error.response?.data || error.message);
      alert('Failed to place order. Please try again.');
    }    
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleStripePayment = async () => {
    const orderData = {
      userId: user?._id || null, // Replace with actual user ID if available
      items: cart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      })),
      total,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: formData.address,
      status: 'pending', // Default status
    };
    try {
      const response = await axios.post('http://localhost:5000/api/v1/create-checkout-session', {
        items: cart,
        total,
        orderData
      });

      const { sessionId } = response.data;
      const stripe:any = await stripePromise;

      // Redirect to Stripe checkout page
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe checkout error:', error);
      }
    } catch (error:any) {
      console.error('Error creating checkout session:', error.message);
    }
  };
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/shop')}
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                <img
                src={`http://localhost:5000/uploads/${item.product.image}`}
                alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product._id,parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                required
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div> */}
            {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  required
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  required
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div> */}
            {/* <button
              type="submit"
              className="w-full py-3 px-6 text-white bg-orange-600 hover:bg-orange-700 rounded-md font-semibold"
            >
              Place Order
            </button> */}
            <button
              type="button"
              onClick={handleStripePayment}
              className="w-full py-3 px-6 text-white bg-orange-600 hover:bg-orange-700 rounded-md font-semibold"
            >
              Pay with Card
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
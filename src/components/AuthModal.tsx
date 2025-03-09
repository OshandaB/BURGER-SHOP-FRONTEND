import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useStore } from '../store/useStore';
import { User } from '../types';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen } = useStore();
  const { setAuth } = useStore(); // Access setAuth to update store
  const { setUser } = useStore(); // Access setAuth to update store

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication here
    console.log('Authentication data:', { email, password, isLogin });
    const userData: User = {
      email,
      name: email.split('@')[0], // Example: using the part before '@' as the name
      password,
      role: 'user', // Assuming default role based on login or sign-up
    };

    try {
      if (isLogin) {
        // Login Request
        const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
          email: userData.email,
          password: userData.password,
        });
        console.log('Login Successful:', loginResponse.data);
        localStorage.setItem('token', loginResponse.data.token);
        localStorage.setItem('email', loginResponse.data.user.email);
        toast.success('Login Successful!');

        setAuth(loginResponse.data.user.email, loginResponse.data.token);
            setUser(loginResponse.data.user);
        // Close the modal
        setAuthModalOpen(false);
     
        // Handle token storage, user state updates, etc.
      } else {
        // Register Request
        const registerResponse = await axios.post('http://localhost:5000/api/v1/auth/register', {
          username: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role
        });
        console.log('Registration Successful:', registerResponse.data);
        toast.success('Registration Successful!');

        // Handle post-registration actions like modal close, etc.
      }
    } catch (error:any) {
      console.error('Error during authentication:', error.response?.data || error.message);
      // You can show an error message in the UI if needed
    }
  };

  return (
    <Dialog
      open={isAuthModalOpen}
      onClose={() => setAuthModalOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
            {isLogin ? 'Login' : 'Sign Up'}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-orange-600 hover:text-orange-500"
              >
                {isLogin ? 'Need an account?' : 'Already have an account?'}
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
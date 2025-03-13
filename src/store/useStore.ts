import { create } from 'zustand';
import { CartItem, Product, User } from '../types';

interface Store {
  cart: CartItem[];
  user: User | null;
  isAuthModalOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setUser: (user: User | null) => void;
  setAuthModalOpen: (isOpen: boolean) => void;
  isAuthenticated: boolean;
  email: string | null;
  token: string | null;
  setAuth: (email: string | null, token: string | null) => void;
  clearAuth: () => void;

}
interface AuthState {
 
}


export const useStore = create<Store>((set) => {
  const storedToken = localStorage.getItem('token');
const storedEmail = localStorage.getItem('email');
const storedUser = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null; // Convert back to object
// If token exists in localStorage, consider the user as authenticated
const isAuthenticated = storedToken && storedEmail ? true : false;
return{
  cart: [],
  user: storedUser,
  isAuthModalOpen: false,
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { product, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ cart: [] }),
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Convert user to a string
    } else {
      localStorage.removeItem('user'); // Remove from storage if null
    }
    set({ user });
  },
  
  
  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
  isAuthenticated:   isAuthenticated  ,
  email: storedEmail,
  token: storedToken,
  setAuth: (email, token) =>{
    localStorage.setItem('email', email || '');
    localStorage.setItem('token', token || '');
    set({ isAuthenticated: true, email, token });
  } ,
  clearAuth: () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    set({ isAuthenticated: false, email: null, token: null });
  },

};

});
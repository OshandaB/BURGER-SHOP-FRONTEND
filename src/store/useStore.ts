import { create } from 'zustand';
import { CartItem, Product, User } from '../types';
import axios from 'axios';
import axiosInstance from '../util/axiosInstance';

interface Store {
  cart: CartItem[];
  user: User | null;
  isAuthModalOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loadCart: () => void;

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


export const useStore = create<Store>((set, get) => {
  const storedToken = localStorage.getItem('token');
  const storedEmail = localStorage.getItem('email');
  const storedUser = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null; // Convert back to object
  // If token exists in localStorage, consider the user as authenticated
  const isAuthenticated = storedToken && storedEmail ? true : false;
  const storedCart = JSON.parse(localStorage.getItem("bcart") || "[]")

  return {
    cart: storedCart,
    user: storedUser,
    isAuthModalOpen: false,
    /** 🔥 Load Cart from Backend or LocalStorage */
    loadCart: async () => {
      if (get().isAuthenticated) {
        try {
          const response = await axiosInstance.get("/cart/", {
            headers: { Authorization: `Bearer ${get().token}` },
          });
          const cartItems = response.data.items; // Assuming response contains an `items` array

          // Fetch product details for each item
          const productRequests = cartItems.map(async (item: any) => {
            try {
              const productResponse = await axiosInstance.get(
                `/products/${item.pId}`
              );
              return { product: productResponse.data, quantity: item.quantity };
            } catch (error) {
              console.error(`Error fetching product ${item.productId}:`, error);
              return null; // Return null for failed requests
            }
          });

          //wait all request done and  null check and if null found filter this value
          const resolvedCartItems = (await Promise.all(productRequests)).filter(
            (item) => item !== null
          );

          set({ cart: resolvedCartItems });
        } catch (error) {
          console.error("Error loading cart:", error);
        }
      } else {
        set({ cart: storedCart });
      }
    },
    addToCart: async (product) => {
      const { isAuthenticated, cart } = get();
      if (isAuthenticated) {
        try {
          const response = await axiosInstance.post("/cart/add",
            { productId: product._id, quantity: 1, pId: product.id },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              }
            },
          );
          get().loadCart();

        } catch (error: any) {
          console.error("Error updating cart:", error);

        }
      } else {
        // If user is a guest, update localStorage
        const existingItem = cart.find((item) => item.product.id === product.id);
        let newCart;
        if (existingItem) {
          newCart = cart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          newCart = [...cart, { product, quantity: 1 }];
        }
        localStorage.setItem("bcart", JSON.stringify(newCart));
        set({ cart: newCart });
      }
    },
    //   set((state) => {
    //     const existingItem = state.cart.find((item) => item.product.id === product.id);
    //     if (existingItem) {
    //       return {
    //         cart: state.cart.map((item) =>
    //           item.product.id === product.id
    //             ? { ...item, quantity: item.quantity + 1 }
    //             : item
    //         ),
    //       };
    //     }
    //     return { cart: [...state.cart, { product, quantity: 1 }] };
    //   }),
    // removeFromCart: (productId) =>
    //   set((state) => ({
    //     cart: state.cart.filter((item) => item.product.id !== productId),
    //   })),
    removeFromCart: (productId) => {
      const { isAuthenticated, cart } = get();

      if (isAuthenticated) {
        axiosInstance
          .post(
            "/cart/remove",
            { productId },
            { headers: { Authorization: `Bearer ${get().token}` } }
          )
          .then(() => get().loadCart())
          .catch((error) => console.error("Error removing item:", error));
      } else {
        // Update localStorage for guests
        const newCart = cart.filter((item) => item.product._id !== productId);
        localStorage.setItem("bcart", JSON.stringify(newCart));
        set({ cart: newCart });
      }
    },
    /** 🔄 Update Quantity */
    updateQuantity: async (productId, quantity) => {
      const { isAuthenticated, cart } = get();
      if (isAuthenticated) {
        try {
          await axiosInstance.put(
            "/cart/update",
            { productId, quantity },
            { headers: { Authorization: `Bearer ${get().token}` } }
          );
          get().loadCart();
        } catch (error) {
          console.error("Error updating quantity:", error);
        }
      } else {
        const newCart = cart.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        );
        localStorage.setItem("bcart", JSON.stringify(newCart));
        set({ cart: newCart });
      }
    },
    // clearCart: () => set({ cart: [] }),
    clearCart: () => {
      if (get().isAuthenticated) {
        axiosInstance.post("/cart/clear",
          {},
          { headers: { Authorization: `Bearer ${get().token}` } }
        )
          .then(() => { console.log("Cart cleared") })
          .catch((error: any) => { console.error("Error clearing cart:", error) })
      }else{
        set({ cart: [] })
      }
    },
    setUser: (user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user)); // Convert user to a string
      } else {
        localStorage.removeItem('user'); // Remove from storage if null
      }
      set({ user });
    },


    setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
    isAuthenticated: isAuthenticated,
    email: storedEmail,
    token: storedToken,
    setAuth: (email, token) => {
      localStorage.setItem('email', email || '');
      localStorage.setItem('token', token || '');
      set({ isAuthenticated: true, email, token });
    },
    clearAuth: () => {
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      set({ isAuthenticated: false, email: null, token: null });
    },

  };

});
export interface Product {
  _id:string;
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock?: 'In Stock';
  ingredients: string,
  calories: string,
  protein: string,
  carbs: string,
  fat: string
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
}

export interface User {
  _id : string;
  email: string;
  name: string;
  password: string,
  role: 'admin' | 'user';
}
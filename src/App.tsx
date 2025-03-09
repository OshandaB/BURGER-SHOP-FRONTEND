import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminAddProduct from './pages/admin/AddProduct';
import AuthModal from './components/AuthModal';
import AdminRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-orange-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/products" element={<AdminProducts />} />
    <Route path="/admin/products/add" element={<AdminAddProduct />} />
  </Route>
          </Routes>
        </main>
        <Footer />
        <AuthModal />
        <Toaster position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
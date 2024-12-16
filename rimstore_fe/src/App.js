import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPanel from './pages/AdminPanel'; // ensure this import is correct

import './styles.css';

const App = () => {
  return (
    <div className="app">
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:product_id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Add the Admin route here */}
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import './Cart.css';


const Cart = () => {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 1. You should load Items in cart from the localStorage
    // 2. parse items loaded from local storage into a list (JSON.parse)
    // 3. Assign items to cart variable setCart(cartItems)
  }, []);

  const handleRemoveFromCart = async (cartItemId) => {
    if (!isLoggedIn) {
      alert('Please log in to manage your cart.');
      return;
    }

    try {
      await apiService.removeFromCart(cartItemId);
      setCart(cart.filter((item) => item.id !== cartItemId));
      alert('Item removed from cart!');
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleAddToCart = async (product) => {
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {!isLoggedIn ? (
        <p>Please log in to view and manage your cart.</p>
      ) : cart.length > 0 ? (
        <div>
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.productId} className="cart-item">
                <p>{item.productName}</p>
                <p>Quantity: {item.quantity}</p>
                <p>${item.price}</p>
                <button onClick={() => handleRemoveFromCart(item.id)} className="remove-btn">Remove</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;

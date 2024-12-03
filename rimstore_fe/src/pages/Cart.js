import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import './Cart.css';


const Cart = () => {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if the token exists

    if (token) {
      const fetchCart = async () => {
        try {
          const response = await apiService.getCart();
          setCart(response.data);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      };

      fetchCart();
    }
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
    if (!isLoggedIn) {
      alert('Please log in to add items to your cart.');
      return;
    }

    try {
      await apiService.addToCart(product);
      alert(`${product.product_name} has been added to your cart!`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
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
              <li key={item.id} className="cart-item">
                <p>{item.product_name}</p>
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

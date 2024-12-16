import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch cart and authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Check if a token exists

    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
      localStorage.removeItem('cart'); // Clear invalid data
    }
  }, []);

  // Add item to cart
  const handleAddToCart = (itemToAddToCart) => {
    if (!itemToAddToCart || typeof itemToAddToCart !== 'object') {
      console.error('Invalid item to add to cart:', itemToAddToCart);
      return;
    }

    try {
      const storedCart = localStorage.getItem('cart');
      let updatedCart = storedCart ? JSON.parse(storedCart) : [];

      const existingItemIndex = updatedCart.findIndex(
        (item) => item.productName === itemToAddToCart.productName
      );

      if (existingItemIndex > -1) {
        updatedCart[existingItemIndex].quantity += itemToAddToCart.quantity;
      } else {
        updatedCart.push(itemToAddToCart);
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch (error) {
      console.error('Error in handleAddToCart:', error);
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = (cartItemId) => {
    if (!isLoggedIn) {
      alert('Please log in to manage your cart.');
      return;
    }

    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        let updatedCart = JSON.parse(storedCart);
        updatedCart = updatedCart
          .map((item) =>
            item.productName === cartItemId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0);

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error in handleRemoveFromCart:', error);
    }
  };

  // Create order and send it to the backend
  const handleCreateOrder = async () => {
    if (!isLoggedIn) {
      alert('Please log in to create an order.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:3001/orders', // Your API endpoint
        { items: cart }, // Send cart items in the request body
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`, // Get token directly from localStorage
          },
        }
      );
  
      console.log('Order created:', response.data);
      alert('Order created successfully!');
      // Clear the cart after successful order creation
      localStorage.removeItem('cart');
      setCart([]);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert('Your session has expired or the token is invalid. Please log in again.');
      } else {
        console.error('Error creating order:', error);
        alert('Failed to create order. Please try again later.');
      }
    }
  };

  // Function to handle quantity increment
  const handleIncrement = (item) => {
    handleAddToCart({ productName: item.productName, quantity: 1 });
  };

  // Function to handle quantity decrement
  const handleDecrement = (item) => {
    handleRemoveFromCart(item.productName);
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {!isLoggedIn ? (
        <p>Please log in to view and manage your cart.</p>
      ) : cart.length > 0 ? (
        <>
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.productName} className="cart-item">
                {item.productImage && (
                  <img src={item.productImage} alt={item.productName || 'Product Image'} />
                )}
                <div className="cart-item-details">
                  <p className="product-name">{item.productName}</p>
                  <p className="product-description">{item.productDescription}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleIncrement(item)}
                      className="quantity-btn"
                      aria-label={`Increase quantity of ${item.productName}`}
                    >
                      ▲
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => handleDecrement(item)}
                      className="quantity-btn"
                      aria-label={`Decrease quantity of ${item.productName}`}
                      disabled={item.quantity === 1}
                    >
                      ▼
                    </button>
                  </div>
                </div>
                {item.productPrice && (
                  <p className="cart-item-price">
                    Total: ${(item.quantity * parseFloat(item.productPrice)).toFixed(2)}
                  </p>
                )}
                <button
                  onClick={() => handleRemoveFromCart(item.productName)}
                  className="remove-btn"
                  aria-label={`Remove ${item.productName} from cart`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleCreateOrder} className="create-order-btn">
            Create Order
          </button>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;

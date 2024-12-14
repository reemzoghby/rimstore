import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import apiService from '../api/apiService';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null); // Holds user information
  const [isAdmin, setIsAdmin] = useState(false); // Check if the user is admin
  const [message, setMessage] = useState(''); // Message for login prompts

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error.response || error.message);
      }
    };

    const fetchUser = async () => {
      try {
        const userData = await apiService.getUser(); // Fetch user information
        setUser(userData);
        setIsAdmin(userData.role === 'admin'); // Check if user is admin
      } catch {
        setUser(null);
        setIsAdmin(false);
      }
    };

    fetchProducts();
    fetchUser();
  }, []);

  const handleAddToCart = (product) => {
    console.log('Adding item to cart...');
    const storedCart = localStorage.getItem('cart');
    const cart = storedCart ? JSON.parse(storedCart) : [];

    const existingProduct = cart.find((p) => p.productId === product.product_id);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({
        productId: product.product_id,
        productName: product.product_name,
        productPrice: product.price,
        productDescription: product.description,
        productImage: product.image_url,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const handleAdminAction = (action, productId) => {
    switch (action) {
      case 'create':
        console.log('Create product logic here');
        break;
      case 'update':
        console.log(`Update product ${productId} logic here`);
        break;
      case 'delete':
        console.log(`Delete product ${productId} logic here`);
        break;
      default:
        console.log('Invalid action');
    }
  };

  return (
    <div className="products-page">
      <h1>Makeup Collection</h1>
      {isAdmin && (
        <div className="admin-panel">
          <h2>Admin Panel</h2>
          <button onClick={() => handleAdminAction('create')}>Create Product</button>
          {products.map((product) => (
            <div key={product.product_id} className="admin-actions">
              <p>{product.product_name}</p>
              <button onClick={() => handleAdminAction('update', product.product_id)}>
                Update
              </button>
              <button onClick={() => handleAdminAction('delete', product.product_id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      {message && <p className="message">{message}</p>}
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.product_id} className="product-card">
              <Link to={`/products/${product.product_id}`} className="product-link">
                {/* Clicking on the image or name navigates to product details */}
                <img
                  src={product.image_url || 'https://via.placeholder.com/300'}
                  alt={product.product_name}
                  className="product-image"
                />
                <h3>{product.product_name}</h3>
              </Link>
              <p>${product.price}</p>
              <button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </div>
  );
};

export default Products;

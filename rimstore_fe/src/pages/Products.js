// src/pages/Products.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import apiService from '../api/apiService';
import SearchBar from '../components/SearchBar'; // Import SearchBar
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null); // Holds user information
  const [isAdmin, setIsAdmin] = useState(false); // Check if the user is admin
  const [message, setMessage] = useState(''); // Message for login prompts
  const [loading, setLoading] = useState(false); // Loading state for products
  const [error, setError] = useState(null); // Error state for products

  // Define fetchProducts using useCallback to memoize the function
  const fetchProducts = useCallback(async (searchQuery = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getProducts(searchQuery); // Pass searchQuery
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error.response || error.message);
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
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

    fetchProducts(); // Fetch all products on mount
    fetchUser();
  }, [fetchProducts]);

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

  // Handle search from SearchBar component
  const handleSearch = (query) => {
    fetchProducts(query);
  };

  return (
    <div className="products-page">
      <h1 className="collection-heading">Makeup Collection</h1>
      {/* Alternatively, with decorative icons:
      <h1 className="collection-heading">
        <FlowerIcon className="flower-icon" />
        Makeup Collection
        <FlowerIcon className="flower-icon" />
      </h1>
      */}

      {/* Integrate the SearchBar component */}
      <SearchBar onSearch={handleSearch} />

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
      
      {/* Display loading or error messages */}
      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}
      
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
          !loading && <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
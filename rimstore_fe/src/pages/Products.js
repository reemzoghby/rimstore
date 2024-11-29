import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getProducts();
        console.log('Fetched products:', response.data); // Log response
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error.response || error.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-page">
      <h1>Makeup Collection</h1>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.product_id} className="product-card">
              <img
                src={product.image || 'https://via.placeholder.com/300'}
                alt={product.product_name}
                className="product-image"
              />
              <h2>{product.product_name}</h2>
              <p>${product.price}</p>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
  
};

export default Products;

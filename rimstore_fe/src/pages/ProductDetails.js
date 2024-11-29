import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../api/apiService';
import './ProductDetails.css';

const ProductDetails = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiService.getProductDetails(product_id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [product_id]);

  const handleAddToCart = async () => {
    try {
      await apiService.addToCart({ product_id, quantity: 1 });
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details-page">
      <img src={product.image} alt={product.product_name} className="product-image" />
      <h1>{product.product_name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <button onClick={handleAddToCart} className="add-to-cart-btn">Add to Cart</button>
    </div>
  );
};

export default ProductDetails;

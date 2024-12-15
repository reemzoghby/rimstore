// AdminPanel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const [newProductData, setNewProductData] = useState({
    product_name: '',
    description: '',
    category: '',
    price: '',
    image_url: ''
  });

  const [editProductData, setEditProductData] = useState({
    product_name: '',
    description: '',
    category: '',
    price: '',
    image_url: ''
  });

  const token = localStorage.getItem('token');
  const BASE_URL = 'http://localhost:3001'; // base URL for your backend

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get(`${BASE_URL}/products`)
      .then(response => {
        console.log('Fetched products:', response.data);
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  };
  const handleAddProduct = async (e) => {
    e.preventDefault();
  
    // Simple validation
    if (!newProductData.product_name || !newProductData.price) {
      alert('Product name and price are required.');
      return;
    }
  
    // Optional: Validate price is a positive number
    if (isNaN(newProductData.price) || Number(newProductData.price) <= 0) {
      alert('Price must be a positive number.');
      return;
    }
  
    console.log('Sending product data:', newProductData); // Log data being sent
  
    try {
      const response = await axios.post(`http://localhost:3001/products`, newProductData, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Product created:', response.data);
      setProducts(prev => [...prev, response.data]);
      setNewProductData({
        product_name: '',
        description: '',
        category: '',
        price: '',
        image_url: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating product:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        alert(`Error: ${error.response.data}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('Error: No response from server.');
      } else {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };
  

  const handleDeleteProduct = (productId) => {
    axios.delete(`${BASE_URL}/products/${productId}`, {
      headers: {
        Authorization: token
      }
    })
    .then(() => {
      console.log(`Product ${productId} deleted`);
      setProducts(prev => prev.filter(p => p.product_id !== productId));
    })
    .catch(error => console.error('Error deleting product:', error));
  };

  const handleShowEditForm = (product) => {
    setShowEditForm(true);
    setEditProductId(product.product_id);
    setEditProductData({
      product_name: product.product_name,
      description: product.description || '',
      category: product.category || '',
      price: product.price,
      image_url: product.image_url || ''
    });
  };

  const handleEditProduct = (e) => {
    e.preventDefault();
    axios.put(`${BASE_URL}/products/${editProductId}`, editProductData, {
      headers: {
        Authorization: token
      }
    })
    .then(response => {
      console.log('Product updated:', response.data);
      setProducts(prev => prev.map(p => p.product_id === editProductId ? response.data : p));
      setShowEditForm(false);
      setEditProductId(null);
      setEditProductData({
        product_name: '',
        description: '',
        category: '',
        price: '',
        image_url: ''
      });
    })
    .catch(error => console.error('Error updating product:', error));
  };

  return (
    <div className="admin-panel-container">
      <h1 className="admin-panel-title">Admin Panel</h1>
      <p>Manage products here.</p>

      <h2>Products</h2>
      <button className="admin-add-btn" onClick={() => setShowAddForm(true)}>Add New Product</button>
      
      {showAddForm && (
        <form className="admin-form" onSubmit={handleAddProduct}>
          <h3>Add New Product</h3>
          <input 
            className="admin-input"
            type="text" 
            placeholder="Product Name" 
            value={newProductData.product_name}
            onChange={e => setNewProductData({...newProductData, product_name: e.target.value})}
            required
          />
          <input 
            className="admin-input"
            type="text" 
            placeholder="Category" 
            value={newProductData.category}
            onChange={e => setNewProductData({...newProductData, category: e.target.value})}
          />
          <input 
            className="admin-input"
            type="number" 
            step="0.01"
            placeholder="Price" 
            value={newProductData.price}
            onChange={e => setNewProductData({...newProductData, price: e.target.value})}
            required
          />
          <input 
            className="admin-input"
            type="url" 
            placeholder="Image URL" 
            value={newProductData.image_url}
            onChange={e => setNewProductData({...newProductData, image_url: e.target.value})}
          />
          <textarea
            className="admin-textarea"
            placeholder="Description"
            value={newProductData.description}
            onChange={e => setNewProductData({...newProductData, description: e.target.value})}
          ></textarea>
          <button className="admin-submit-btn" type="submit">Create Product</button>
          <button className="admin-cancel-btn" type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
        </form>
      )}

      {showEditForm && (
        <form className="admin-form" onSubmit={handleEditProduct}>
          <h3>Edit Product</h3>
          <input 
            className="admin-input"
            type="text" 
            placeholder="Product Name" 
            value={editProductData.product_name}
            onChange={e => setEditProductData({...editProductData, product_name: e.target.value})}
            required
          />
          <input 
            className="admin-input"
            type="text" 
            placeholder="Category" 
            value={editProductData.category}
            onChange={e => setEditProductData({...editProductData, category: e.target.value})}
          />
          <input 
            className="admin-input"
            type="number" 
            step="0.01"
            placeholder="Price" 
            value={editProductData.price}
            onChange={e => setEditProductData({...editProductData, price: e.target.value})}
            required
          />
          <input 
            className="admin-input"
            type="url" 
            placeholder="Image URL" 
            value={editProductData.image_url}
            onChange={e => setEditProductData({...editProductData, image_url: e.target.value})}
          />
          <textarea
            className="admin-textarea"
            placeholder="Description"
            value={editProductData.description}
            onChange={e => setEditProductData({...editProductData, description: e.target.value})}
          ></textarea>
          <button className="admin-submit-btn" type="submit">Save Changes</button>
          <button className="admin-cancel-btn" type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
        </form>
      )}

      <ul className="admin-product-list">
        {products.length > 0 ? (
          products.map(product => (
            <li className="admin-product-item" key={product.product_id}>
            <strong>{product.product_name}</strong> - ${product.price}<br />
            {/* Add the image element here */}
            {product.image_url && (
              <img 
                src={product.image_url} 
                alt={product.product_name} 
                style={{ width: '100px', height: 'auto', marginTop: '10px' }}
              />
            )}
            <br />
            <button className="admin-edit-btn" onClick={() => handleShowEditForm(product)}>Edit</button>
            <button className="admin-delete-btn" onClick={() => handleDeleteProduct(product.product_id)}>Delete</button>
          </li>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminPanel;

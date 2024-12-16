// AdminPanel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  // Existing state variables for products
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

  
  // New state variables for orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState(null);

  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem('token');
  const BASE_URL = 'http://localhost:3001'; // Update this if your backend runs on a different URL or port

  useEffect(() => {
    fetchProducts();
    fetchOrders(); // Fetch orders when component mounts
  }, []);

  // Existing fetchProducts function
  const fetchProducts = () => {
    axios.get(`${BASE_URL}/products`)
      .then(response => {
        console.log('Fetched products:', response.data);
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  // Finalized fetchOrders function
  const fetchOrders = () => {
    setLoadingOrders(true);
    setErrorOrders(null);

    // Ensure the token exists before making the request
    if (!token) {
      console.error('No authentication token found.');
      setErrorOrders('Authentication token is missing. Please log in again.');
      setLoadingOrders(false);
      return;
    }

    axios
      .get(`${BASE_URL}/admin/orders`, {
        headers: {
          Authorization: `${token}`, // Include the 'Bearer ' prefix
          'Content-Type': 'application/json', // Optional: Specify content type
        },
      })
      .then((response) => {
        console.log('Fetched orders:', response.data);
        setOrders(response.data);
        setLoadingOrders(false);
      })
      .catch((error) => {
        // Enhanced error handling
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error(
            'Error fetching orders:',
            error.response.status,
            error.response.data
          );
          if (error.response.status === 401) {
            setErrorOrders('Unauthorized. Please log in.');
          } else if (error.response.status === 403) {
            setErrorOrders('Forbidden. Admin privileges required.');
          } else {
            setErrorOrders(`Error: ${error.response.data}`);
          }
        } else if (error.request) {
          // Request was made but no response received
          console.error('Error fetching orders: No response received', error.request);
          setErrorOrders('No response from server. Please try again later.');
        } else {
          // Something else happened while setting up the request
          console.error('Error fetching orders:', error.message);
          setErrorOrders(`Error: ${error.message}`);
        }
        setLoadingOrders(false);
      });
  };

  // Existing handleAddProduct function
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
      const response = await axios.post(`${BASE_URL}/products`, newProductData, {
        headers: {
          Authorization: `Bearer ${token}`, // Added 'Bearer ' prefix
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
  
  // Existing handleDeleteProduct function
  const handleDeleteProduct = (productId) => {
    axios.delete(`${BASE_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Added 'Bearer ' prefix
      }
    })
    .then(() => {
      console.log(`Product ${productId} deleted`);
      setProducts(prev => prev.filter(p => p.product_id !== productId));
    })
    .catch(error => console.error('Error deleting product:', error));
  };

  // Existing handleShowEditForm function
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

  // Existing handleEditProduct function
  const handleEditProduct = (e) => {
    e.preventDefault();
    axios.put(`${BASE_URL}/products/${editProductId}`, editProductData, {
      headers: {
        Authorization: `Bearer ${token}` // Added 'Bearer ' prefix
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
      <p>Manage products and view orders here.</p>

      {/* Products Management Section */}
      <h2>Products</h2>
      <button className="admin-add-btn" onClick={() => setShowAddForm(true)}>Add New Product</button>
      
      {/* Add Product Form */}
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

      {/* Edit Product Form */}
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

      {/* Products List */}
      <ul className="admin-product-list">
        {products.length > 0 ? (
          products.map(product => (
            <li className="admin-product-item" key={product.product_id}>
              <strong>{product.product_name}</strong> - ${product.price}<br />
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

    {/* Orders Management Section */}
<h2>Orders</h2>
<button className="admin-refresh-btn" onClick={fetchOrders}>Refresh Orders</button>

{loadingOrders && <p>Loading orders...</p>}
{errorOrders && <p className="error">{errorOrders}</p>}

<ul className="admin-order-list">
  {orders.length > 0 ? (
    orders.map(order => {
      console.log("Order Data:", order); // Debugging
      return (
        <li className="admin-order-item" key={order.order_id}>
          <strong>Order ID: {order.order_id}</strong> <br />
          <strong>User: {order.user?.first_name || "Unknown"} {order.user?.last_name || "Unknown"} </strong>  <br />
          <strong>Total Amount: ${typeof order.total_amount === 'number' && !isNaN(order.total_amount) ? order.total_amount.toFixed(2) : "0.00"} </strong>  <br />
          <strong>Status: {order.order_status || "Unknown"} </strong><br />
          <strong>Items:</strong>
          <ul>
            {order.order_items.map(item => {
              console.log("Order Item Data:", item); // Debugging
              return (
                <li key={item.order_item_id}>
                  <strong>Product:{item.product_name || "Unknown Product"} </strong>  <br/>
                
                  <strong>Quantity: {item.quantity || "N/A"} </strong> <br />
                  <strong>Total Price: ${typeof item.product_price === 'number' && !isNaN(item.product_price) ? (item.quantity * item.product_price).toFixed(2) : "0.00"}</strong>
                </li>
              );
            })}
          </ul>
          <strong>Created At: {order.created_at ? new Date(order.created_at).toLocaleString() : "Unknown"}</strong> 
         
        </li>
      );
    })
  ) : (
    !loadingOrders && <p>No orders available.</p>
  )}
</ul>


    </div>
  );
};

export default AdminPanel;

import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response || error.message);
    if (error.response && error.response.status === 401) {
      alert('Your session has expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const apiService = {
  // Authentication
  login: (data) => api.post('/users/login', data),
  signup: (data) => api.post('/users/signup', data),

  // Products
  getProducts: (searchQuery = '') => {
    if (searchQuery) {
      return api.get('/products', {
        params: { search: searchQuery },
      });
    }
    return api.get('/products');
  },
  getProductDetails: (productId) => api.get(`/products/${productId}`),

  // Orders
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),

  // Additional Utility Methods
  updateCart: (cartItemId, data) => api.put(`/cart/${cartItemId}`, data), // Update cart item quantity
  updateProduct: (productId, data) => api.put(`/products/${productId}`, data), // Update a product (admin-only)
  deleteProduct: (productId) => api.delete(`/products/${productId}`), // Delete a product (admin-only)
};

export default apiService;

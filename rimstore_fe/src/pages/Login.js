import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 // Login.js
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await apiService.login({ email, password });

    // Store both token and is_admin in local storage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('is_admin', response.data.is_admin);

    // Navigate to products after login
    navigate('/products');
  } catch (error) {
    console.error('Login error:', error);
    alert(error.response?.data?.message || 'Invalid credentials!');
  }
};
 

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;

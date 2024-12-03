import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.login({ email, password });

      // Save token and user info
      localStorage.setItem('token', response.data.token);
     
      console.log('login successful')
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

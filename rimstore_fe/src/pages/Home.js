import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => (
  <div className="home-page">
    <h1>Welcome to RimStore</h1>
    <p>Your one-stop shop for beauty products!</p>
    <Link to="/products" className="btn">Explore Products</Link>
  </div>
);

export default Home;

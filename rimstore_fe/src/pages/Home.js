import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section">
        <img
          src="https://i.pinimg.com/474x/e8/99/97/e899978cce107a09af5ad2b180ce432f.jpg"
          alt="Cover"
          className="hero-image"
        />
        <div className="hero-overlay">
          <h1>Welcome to RimStore</h1>
          <p>Your one-stop shop for premium makeup products.</p>
          <Link to="/products" className="shop-now-button">
            Shop Now
          </Link>
        </div>
      </div>

      </div>
  
  );
};

export default Home;

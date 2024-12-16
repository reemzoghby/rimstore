import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="homepage">
      {/* Snowfall Animation */}
      <div className="snowflakes" aria-hidden="true">
        <div className="snowflake">❅</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <img
          src="https://i.pinimg.com/736x/b9/66/16/b966165e462e75c9b2c7ede30169b9c1.jpg"
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
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="container">
          <h2>About Us</h2>
          <p>
            At RimStore, we believe that makeup is a form of self-expression and a tool to enhance your natural beauty. Our curated collection offers a blend of timeless classics and the latest trends, ensuring you find the perfect products to complement your unique style. Whether you're a makeup novice or a seasoned pro, RimStore is here to support your beauty journey with quality, affordability, and exceptional customer service.
          </p>
          {/* Decorative Floral Element */}
          <div className="decorative-flower">
            🌸
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

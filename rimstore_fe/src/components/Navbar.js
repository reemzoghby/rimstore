import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  // Check if there's a logged-in user
  const token = localStorage.getItem('token');
  
  // Check if user is admin
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    alert('You have been logged out!');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">RimStore</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        
        {/* If user is admin, show the Admin Panel link */}
        {isAdmin && (
          <li><Link to="/admin">Admin Panel</Link></li>
        )}

        {token ? (
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

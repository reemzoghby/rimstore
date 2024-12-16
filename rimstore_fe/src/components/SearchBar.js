// src/components/SearchBar.js
import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import './SearchBar.css'; // Optional: For styling

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState('');

  // Debounced search function to prevent excessive API calls
  const debouncedSearch = useCallback(
    debounce((query) => {
      onSearch(query);
    }, 500), // 500ms delay
    [onSearch]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    debouncedSearch.flush(); // Immediately invoke the debounced function
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Search products..."
        className="search-input"
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;

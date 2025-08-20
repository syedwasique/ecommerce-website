import React from 'react';
import { Link } from 'react-router-dom';
import './Category.css';

const CategoriesPage = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="categories-page">
        <h1 className="page-title">Shop By Category</h1>
        <div className="no-categories">
          <p>No categories available at the moment.</p>
          <Link to="/" className="home-link">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="header-section">
        <h1 className="page-title">Discover Your Perfect Pair</h1>
        <p className="page-subtitle">Explore our premium collection designed for every step of your journey</p>
      </div>
      
      <div className="categories-grid">
        {categories.map(category => (
          <div 
            key={category.id}
            className="category-card-wrapper"
          >
            <Link 
              to={`/category/${category.id}`}
              className="category-card"
            >
              <div 
                className="category-image"
                style={{ backgroundImage: `url(${category.image_url})` }}
              ></div>
              <div className="category-content">
                {/* FIXED: Check if category.name exists before rendering */}
                {category.name && (
                  <div className="category-badge">{category.name}</div>
                )}
                <h2 className="category-title">{category.name || 'Unnamed Category'}</h2>
                <p className="category-description">{category.description || 'Explore our premium collection'}</p>
                <button className="explore-btn">
                  Explore Collection
                  <span className="arrow">→</span>
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
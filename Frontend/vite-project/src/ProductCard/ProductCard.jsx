// src/components/ProductCard/ProductCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cartcontext/cartcontext';
import './ProductCard.css'; 
import { useAuth } from '../Authcontext'; 

const ProductCard = ({ product, children }) => {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!currentUser) {
      navigate('/login', { 
        state: { 
          message: 'Please sign in to add items to your cart',
          returnUrl: window.location.pathname 
        } 
      });
      return;
    }

    addToCart({
      ...product,
      color: product.colors?.length > 0 ? product.colors[0] : '',
      quantity: 1
    });
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Safely format the price
  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (typeof numericPrice === 'number' && !isNaN(numericPrice)) {
      return `$${numericPrice.toFixed(2)}`;
    }
    return 'Price unavailable';
  };

  return (
    <div className="product-card" onClick={handleProductClick}>
      <div 
        className="product-image-container"
        style={{ 
          backgroundImage: `url(${product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'})`,
        }}
      >
        {product.release_date && product.release_date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
          <div className="new-badge">NEW</div>
        )}
        <div className="category-badge">
          {product.category_name || `Category ${product.category_id}`}
        </div>
      </div>
      
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{formatPrice(product.price)}</p>
        </div>
        
        <p className="product-description">{product.description}</p>
        
        {/* Render additional children content */}
        {children}
        
        <div className="product-actions">
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
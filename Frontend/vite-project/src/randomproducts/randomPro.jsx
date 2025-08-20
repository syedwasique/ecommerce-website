import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './randomP.module.css';
import { useCart } from '../cartcontext/cartcontext';
import { useAuth } from '../Authcontext';

const RandomProducts = ({ products, loading }) => {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    const num = Number(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const handleAddToCart = (product, e) => {
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

  const renderPrice = (product) => {
    if (product.tags?.includes('deal')) {
      return (
        <div className={styles.priceContainer}>
          <span className={styles.originalPrice}>${formatPrice(product.base_price)}</span>
          <span className={styles.discountPrice}>${formatPrice(product.discount_price)}</span>
        </div>
      );
    }
    return <span className={styles.productPrice}>${formatPrice(product.price)}</span>;
  };

  const getProductType = (product) => {
    if (product.tags?.includes('new_arrival')) return 'new-arrival';
    if (product.tags?.includes('best_seller')) return 'best-seller';
    if (product.tags?.includes('deal')) return 'deal';
    return '';
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Curating collection...</p>
    </div>
  );

  return (
    <section className={styles.featuredSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Curated Selection</h2>
        <p className={styles.sectionSubtitle}>Handpicked for discerning tastes</p>
      </div>
      
      <div className={styles.productsGrid}>
        {products.map((product) => {
          const productType = getProductType(product);
          return (
            <div className={styles.productCard} key={product.id}>
              {productType === 'new-arrival' && (
                <div className={`${styles.productBadge} ${styles.newBadge}`}>Just In</div>
              )}
              {productType === 'best-seller' && (
                <div className={`${styles.productBadge} ${styles.bestBadge}`}>Essential</div>
              )}
              {productType === 'deal' && (
                <div className={`${styles.productBadge} ${styles.saleBadge}`}>Private Offer</div>
              )}
              
              <div className={styles.productMedia}>
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className={styles.productImage}
                    loading="lazy"
                  />
                </Link>
                <button className={styles.wishlistButton}>
                  <i className="far fa-heart"></i>
                </button>
              </div>
              
              <div className={styles.productDetails}>
                <Link to={`/product/${product.id}`} className={styles.productLink}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  
                  <div className={styles.productFeatures}>
                    {product.features?.map((feature, i) => (
                      <span key={i} className={styles.featureTag}>
                        <i className={`fas ${feature.icon}`}></i> {feature.text}
                      </span>
                    ))}
                  </div>
                </Link>
                
                <div className={styles.productActions}>
                  {renderPrice(product)}
                  <button 
                    className={styles.addToCart}
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <span>Add to Cart</span>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={styles.sectionFooter}>
        <Link to="/collections" className={styles.viewAll}>
          View Complete Collection <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </section>
  );
};

export default RandomProducts;



// import React from 'react';
// import { Link } from 'react-router-dom';
// import  './randomP.css';

// const RandomProducts = ({ products, loading }) => {
//   const renderPrice = (product) => {
//     if (product.discount_price) {
//       return (
//         <div className="price-container">
//           <span className="original-price">${product.original_price.toFixed(2)}</span>
//           <span className="discount-price">${product.discount_price.toFixed(2)}</span>
//         </div>
//       );
//     }
//     return <span className="product-price">${product.price.toFixed(2)}</span>;
//   };

//   if (loading) return (
//     <div className="loading-container">
//       <div className="loading-spinner"></div>
//       <p>Curating collection...</p>
//     </div>
//   );

//   return (
//     <section className="featured-section">
//       <div className="section-header">
//         <h2 className="section-title">Curated Selection</h2>
//         <p className="section-subtitle">Handpicked for discerning tastes</p>
//       </div>
      
//       <div className="products-grid">
//         {products.map((product) => (
//           <div className="product-card" key={product.id}>
//             {product.type === 'new-arrival' && (
//               <div className="product-badge new">Just In</div>
//             )}
//             {product.type === 'best-seller' && (
//               <div className="product-badge best">Essential</div>
//             )}
//             {product.type === 'deal' && (
//               <div className="product-badge sale">Private Offer</div>
//             )}
            
//             <div className="product-media">
//               <Link to={`/product/${product.id}`}>
//                 <img 
//                   src={product.image_url} 
//                   alt={product.name} 
//                   className="product-image"
//                   loading="lazy"
//                 />
//               </Link>
//               <button className="wishlist-button">
//                 <i className="far fa-heart"></i>
//               </button>
//             </div>
            
//             <div className="product-details">
//               <Link to={`/product/${product.id}`} className="product-link">
//                 <h3 className="product-name">{product.name}</h3>
                
//                 <div className="product-features">
//                   {product.features?.map((feature, i) => (
//                     <span key={i} className="feature-tag">
//                       <i className={`fas ${feature.icon}`}></i> {feature.text}
//                     </span>
//                   ))}
//                 </div>
//               </Link>
              
//               <div className="product-actions">
//                 {renderPrice(product)}
//                 <button className="add-to-cart">
//                   <span>Add to Wardrobe</span>
//                   <i className="fas fa-chevron-right"></i>
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       <div className="section-footer">
//         <Link to="/collections" className="view-all">
//           View Complete Collection <i className="fas fa-arrow-right"></i>
//         </Link>
//       </div>
//     </section>
//   );
// };

// export default RandomProducts;
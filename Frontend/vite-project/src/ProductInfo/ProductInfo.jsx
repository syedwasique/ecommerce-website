import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../cartcontext/cartcontext';
import { useAuth } from '../Authcontext'; 
import SizeSelector from '../sizeSelector/sizeSelector';
import styles from './ProductInfo.module.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [availableSizes, setAvailableSizes] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`api/api/product/${id}`);
        
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }
        
        const data = await response.json();
        
        const price = parseFloat(data.price) || 0;
        const originalPrice = parseFloat(data.original_price) || 0;
        let discount = 0;

        if (originalPrice > 0 && price < originalPrice) {
          discount = Math.round((1 - price / originalPrice) * 100);
        }

        // Set available sizes from product data or default sizes
        const sizes = data.available_sizes || ['7', '8', '9', '10', '11', '12'];
        
        setProduct({
          ...data,
          price,
          originalPrice,
          discount,
          average_rating: data.average_rating || 0,
          review_count: data.review_count || 0
        });
        
        setCurrentPrice(price);
        setAvailableSizes(sizes);
        
        if (data.colors?.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!currentUser) {
      navigate('/login', { 
        state: { 
          message: 'Please sign in to add items to your cart',
          returnUrl: window.location.pathname 
        } 
      });
      return;
    }

    if (!selectedSize) {
      alert('Please select a size before adding to cart');
      return;
    }

    if (product) {
      addToCart({
        ...product,
        color: selectedColor,
        quantity: quantity,
        size: selectedSize,
        price: currentPrice
      });
    }
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      navigate('/login', { 
        state: { 
          message: 'Please sign in to complete your purchase',
          returnUrl: window.location.pathname 
        } 
      });
      return;
    }

    if (!selectedSize) {
      alert('Please select a size before proceeding to checkout');
      return;
    }

    if (product) {
      addToCart({
        ...product,
        color: selectedColor,
        quantity: quantity,
        size: selectedSize,
        price: currentPrice
      });
      navigate('/checkout');
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className={styles.productLoadingContainer}>
        <div className={styles.productSpinner}></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.productNotFound}>
        <div className={styles.errorIcon}>❌</div>
        <h2>Product Not Found</h2>
        <p>{error || "The product you're looking for doesn't exist or has been removed."}</p>
        <p>It might be in one of these categories:</p>
        
        <div className={styles.categorySuggestions}>
          <button onClick={() => navigate('/best-sellers')}>Best Sellers</button>
          <button onClick={() => navigate('/deals')}>Hot Deals</button>
          <button onClick={() => navigate('/new-arrivals')}>New Arrivals</button>
        </div>
        
        <button className={styles.backButton} onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className={styles.productDetailContainer}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button onClick={() => navigate('/')}>Home</button>
        <span> / </span>
        <button onClick={() => navigate('/products')}>Products</button>
        <span> / </span>
        <span className={styles.current}>{product.name}</span>
      </div>
      
      {/* Product Container */}
      <div className={styles.productContent}>
        {/* Product Gallery */}
        <div className={styles.productGallery}>
          <div className={styles.mainImage}>
            <img 
              src={product.image_url || 'https://via.placeholder.com/600x600?text=No+Image'} 
              alt={product.name} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
              }}
            />
          </div>
          
          {product.additional_images && product.additional_images.length > 0 && (
            <div className={styles.thumbnailContainer}>
              {[product.image_url, ...product.additional_images].map((img, index) => (
                <div 
                  key={index} 
                  className={`${styles.thumbnail} ${index === activeImage ? styles.active : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} view ${index + 1}`} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Img';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Information */}
        <div className={styles.productInfo}>
          {product.is_new && <div className={styles.launchBadge}>NEW LAUNCH</div>}
          
          <div className={styles.productHeader}>
            <h1>{product.name}</h1>
            <div className={styles.productRating}>
              <div className={styles.stars}>
                {'★'.repeat(Math.floor(product.average_rating || 0))}
                {'☆'.repeat(5 - Math.floor(product.average_rating || 0))}
              </div>
              <span>{product.average_rating?.toFixed(1) || '0.0'} ({product.review_count || 0} reviews)</span>
            </div>
            <p className={styles.productDescription}>{product.description}</p>
          </div>
          
          {/* Pricing Section */}
          <div className={styles.pricingSection}>
            <div className={styles.priceDisplay}>
              <div className={styles.currentPrice}>${currentPrice.toFixed(2)}</div>
              {product.originalPrice > product.price && (
                <>
                  <div className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</div>
                  {product.discount > 0 && (
                    <div className={styles.discountBadge}>Save {product.discount}%</div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Offer Timer */}
          {product.discount > 0 && (
            <div className={styles.offerTimer}>
              <h3>Limited Time Offer</h3>
              <div className={styles.timerDisplay}>
                <div className={styles.timeUnit}>
                  <span>02</span>
                  <span>hr</span>
                </div>
                <div className={styles.timeUnit}>
                  <span>30</span>
                  <span>min</span>
                </div>
                <div className={styles.timeUnit}>
                  <span>45</span>
                  <span>sec</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Size Selection */}
          <div className={styles.sizeSelection}>
            <div className={styles.selectionLabel}>Select Size:</div>
            <SizeSelector 
              basePrice={product.price}
              onSizeChange={(size, price) => {
                setSelectedSize(size);
                setCurrentPrice(price);
              }}
              availableSizes={availableSizes}
            />
          </div>
          
          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className={styles.colorSelection}>
              <div className={styles.selectionLabel}>Color: <span className={styles.selectedColor}>{selectedColor}</span></div>
              <div className={styles.colorOptions}>
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`${styles.colorOption} ${selectedColor === color ? styles.selected : ''}`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity Selection */}
          <div className={styles.quantitySelection}>
            <div className={styles.selectionLabel}>Quantity:</div>
            <div className={styles.quantityControl}>
              <button onClick={decreaseQuantity} aria-label="Decrease quantity">-</button>
              <span>{quantity}</span>
              <button onClick={increaseQuantity} aria-label="Increase quantity">+</button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button className={styles.buyNowBtn} onClick={handleBuyNow}>
              BUY NOW
            </button>
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              ADD TO CART
            </button>
          </div>

          {/* Review Button */}
          <div className={styles.reviewButtonContainer}>
            <button 
              className={styles.reviewButton}
              onClick={() => navigate(`/product/${id}/reviews`)}
            >
              <i className="fas fa-star"></i> View Reviews
            </button>
          </div>
          
          {/* Product Benefits */}
          <div className={styles.productBenefits}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🚚</div>
              <div className={styles.benefitText}>Free Shipping</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🔄</div>
              <div className={styles.benefitText}>Easy Returns</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🔒</div>
              <div className={styles.benefitText}>Secure Payment</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🏷️</div>
              <div className={styles.benefitText}>1-Year Warranty</div>
            </div>
          </div>
          
          {/* Product Features */}
          {product.features && product.features.length > 0 && (
            <div className={styles.productFeatures}>
              <h3>Key Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>
                    <span className={styles.featureIcon}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Product Specifications */}
      {product.specifications && (
        <div className={styles.productSpecifications}>
          <h2>Product Specifications</h2>
          <div className={styles.specGrid}>
            {Object.entries(product.specifications).map(([key, value], index) => (
              <div className={styles.specItem} key={index}>
                <div className={styles.specKey}>{key}</div>
                <div className={styles.specValue}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;



//   import React, { useState, useEffect } from 'react';
//   import { useParams, useNavigate } from 'react-router-dom';
//   import { useCart } from '../cartcontext/cartcontext';
//   import { useAuth } from '../Authcontext'; 
// import styles from './ProductInfo.module.css'

//   const ProductDetail = () => {
//     const { id } = useParams();
//     const navigate = useNavigate(); 
//     const { addToCart } = useCart();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [selectedColor, setSelectedColor] = useState('');
//     const [quantity, setQuantity] = useState(1);
//     const [activeImage, setActiveImage] = useState(0);
//     const [error, setError] = useState(null);
//     const { currentUser } = useAuth();
    

//     useEffect(() => {
//       const fetchProduct = async () => {
//         try {
//           setLoading(true);
//           setError(null);
          
//           // Use the unified product endpoint
//           const response = await fetch(`api/api/product/${id}`);
          
//           if (response.status === 404) {
//             throw new Error('Product not found');
//           }
          
//           if (!response.ok) {
//             throw new Error(`Failed to fetch product: ${response.status}`);
//           }
          
//           const data = await response.json();
          
//           const price = parseFloat(data.price) || 0;
//           const originalPrice = parseFloat(data.original_price) || 0;
//           let discount = 0;

//           if (originalPrice > 0 && price < originalPrice) {
//             discount = Math.round((1 - price / originalPrice) * 100);
//           }

//           setProduct({
//             ...data,
//             price,
//             originalPrice,
//             discount
//           });
          
//           if (data.colors?.length > 0) {
//             setSelectedColor(data.colors[0]);
//           }
          
//           setLoading(false);
//         } catch (error) {
//           console.error('Error fetching product:', error);
//           setError(error.message);
//           setLoading(false);
//         }
//       };

//       fetchProduct();
//     }, [id]);

//   const handleAddToCart = () => {
//       if (!currentUser) {
//         navigate('/login', { 
//           state: { 
//             message: 'Please sign in to add items to your cart',
//             returnUrl: window.location.pathname 
//           } 
//         });
//         return;
//       }

//       if (product) {
//         addToCart({
//           ...product,
//           color: selectedColor,
//           quantity: quantity
//         });
//       }
//     };

//     const handleBuyNow = () => {
//       if (!currentUser) {
//         navigate('/login', { 
//           state: { 
//             message: 'Please sign in to complete your purchase',
//             returnUrl: window.location.pathname 
//           } 
//         });
//         return;
//       }

//       if (product) {
//         addToCart({
//           ...product,
//           color: selectedColor,
//           quantity: quantity
//         });
//         navigate('/checkout');
//       }
//     };

//     const increaseQuantity = () => {
//       setQuantity(prev => prev + 1);
//     };

//     const decreaseQuantity = () => {
//       if (quantity > 1) {
//         setQuantity(prev => prev - 1);
//       }
//     };

//     if (loading) {
//       return (
//         <div className="product-loading-container">
//           <div className="product-spinner"></div>
//           <p>Loading product details...</p>
//         </div>
//       );
//     }

//     if (error || !product) {

// return (
//       <div className={styles.productNotFound}>
//         <div className={styles.errorIcon}>❌</div>
//         <h2>Product Not Found</h2>
//         <p>{error || "The product you're looking for doesn't exist or has been removed."}</p>
//         <p>It might be in one of these categories:</p>
        
//         <div className={styles.categorySuggestions}>
//           <button onClick={() => navigate('/best-sellers')}>Best Sellers</button>
//           <button onClick={() => navigate('/deals')}>Hot Deals</button>
//           <button onClick={() => navigate('/new-arrivals')}>New Arrivals</button>
//         </div>
        
//         <button className={styles.backButton} onClick={() => navigate('/')}>
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.productDetailContainer}>
//       {/* Breadcrumb */}
//       <div className={styles.breadcrumb}>
//         <button onClick={() => navigate('/')}>Home</button>
//         <span> / </span>
//         <button onClick={() => navigate('/products')}>Products</button>
//         <span> / </span>
//         <span className={styles.current}>{product.name}</span>
//       </div>
      
//       {/* Product Container */}
//       <div className={styles.productContent}>
//         {/* Product Gallery */}
//         <div className={styles.productGallery}>
//           <div className={styles.mainImage}>
//             <img 
//               src={product.image_url || 'https://via.placeholder.com/600x600?text=No+Image'} 
//               alt={product.name} 
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
//               }}
//             />
//           </div>
          
//           {product.additional_images && product.additional_images.length > 0 && (
//             <div className={styles.thumbnailContainer}>
//               {[product.image_url, ...product.additional_images].map((img, index) => (
//                 <div 
//                   key={index} 
//                   className={`${styles.thumbnail} ${index === activeImage ? styles.active : ''}`}
//                   onClick={() => setActiveImage(index)}
//                 >
//                   <img 
//                     src={img} 
//                     alt={`${product.name} view ${index + 1}`} 
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = 'https://via.placeholder.com/100x100?text=No+Img';
//                     }}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
        
//         {/* Product Information */}
//         <div className={styles.productInfo}>
//           <div className={styles.productHeader}>
//             <h1>{product.name}</h1>
//             <div className={styles.productRating}>
//               <div className={styles.stars}>
//                 {'★'.repeat(Math.floor(product.rating || 4))}
//                 {'☆'.repeat(5 - Math.floor(product.rating || 4))}
//               </div>
//               <span>{product.rating || 4.5} ({product.review_count || 0} reviews)</span>
//             </div>
//             <p className={styles.productDescription}>{product.description}</p>
//           </div>
          
//           {/* Pricing Section */}
//           <div className={styles.pricingSection}>
//             <div className={styles.priceDisplay}>
//               <div className={styles.currentPrice}>${product.price.toFixed(2)}</div>
//               {product.originalPrice > product.price && (
//                 <div className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</div>
//               )}
//             </div>
            
//             {product.discount > 0 && (
//               <div className={styles.discountBadge}>Save {product.discount}%</div>
//             )}
//           </div>
          
//           {/* Offer Timer */}
//           {product.discount > 0 && (
//             <div className={styles.offerTimer}>
//               <h3>Limited Time Offer</h3>
//               <div className={styles.timerDisplay}>
//                 <div className={styles.timeUnit}>
//                   <span>02</span>
//                   <span>hr</span>
//                 </div>
//                 <div className={styles.timeUnit}>
//                   <span>30</span>
//                   <span>min</span>
//                 </div>
//                 <div className={styles.timeUnit}>
//                   <span>45</span>
//                   <span>sec</span>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {/* Color Selection */}
//           {product.colors && product.colors.length > 0 && (
//             <div className={styles.colorSelection}>
//               <div className={styles.selectionLabel}>Color: <span className={styles.selectedColor}>{selectedColor}</span></div>
//               <div className={styles.colorOptions}>
//                 {product.colors.map((color, index) => (
//                   <button
//                     key={index}
//                     className={`${styles.colorOption} ${selectedColor === color ? styles.selected : ''}`}
//                     style={{ backgroundColor: color.toLowerCase() }}
//                     onClick={() => setSelectedColor(color)}
//                     aria-label={`Select ${color} color`}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* Quantity Selection */}
//           <div className={styles.quantitySelection}>
//             <div className={styles.selectionLabel}>Quantity:</div>
//             <div className={styles.quantityControl}>
//               <button onClick={decreaseQuantity} aria-label="Decrease quantity">-</button>
//               <span>{quantity}</span>
//               <button onClick={increaseQuantity} aria-label="Increase quantity">+</button>
//             </div>
//           </div>
          
//           {/* Action Buttons */}
//           <div className={styles.actionButtons}>
//             <button className={styles.buyNowBtn} onClick={handleBuyNow}>
//               BUY NOW
//             </button>
//             <button className={styles.addToCartBtn} onClick={handleAddToCart}>
//               ADD TO CART
//             </button>
//           </div>
          
//           {/* Product Stats */}
//           <div className={styles.productStats}>
//             <div className={styles.statItem}>
//               <span className={styles.statIcon}>🚚</span>
//               <span>Free shipping on orders over $50</span>
//             </div>
//             <div className={styles.statItem}>
//               <span className={styles.statIcon}>🔄</span>
//               <span>30-day easy returns</span>
//             </div>
//             <div className={styles.statItem}>
//               <span className={styles.statIcon}>🔒</span>
//               <span>Secure checkout</span>
//             </div>
//           </div>
          
//           {/* Product Features */}
//           {product.features && product.features.length > 0 && (
//             <div className={styles.productFeatures}>
//               <h3>Key Features</h3>
//               <ul>
//                 {product.features.map((feature, index) => (
//                   <li key={index}>
//                     <span className={styles.featureIcon}>✓</span>
//                     {feature}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Product Specifications */}
//       {product.specifications && (
//         <div className={styles.productSpecifications}>
//           <h2>Product Specifications</h2>
//           <div className={styles.specGrid}>
//             {Object.entries(product.specifications).map(([key, value], index) => (
//               <div className={styles.specItem} key={index}>
//                 <div className={styles.specKey}>{key}</div>
//                 <div className={styles.specValue}>{value}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDetail;


  //     return (
  //       <div className="product-not-found">
  //         <div className="error-icon">❌</div>
  //         <h2>Product Not Found</h2>
  //         <p>{error || "The product you're looking for doesn't exist or has been removed."}</p>
  //         <p>It might be in one of these categories:</p>
          
  //         <div className="category-suggestions">
  //           <button onClick={() => navigate('/best-sellers')}>Best Sellers</button>
  //           <button onClick={() => navigate('/deals')}>Hot Deals</button>
  //           <button onClick={() => navigate('/new-arrivals')}>New Arrivals</button>
  //         </div>
          
  //         <button className="back-button" onClick={() => navigate('/')}>
  //           Continue Shopping
  //         </button>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="product-detail-container">
  //       {/* Breadcrumb */}
  //       <div className="breadcrumb">
  //         <button onClick={() => navigate('/')}>Home</button>
  //         <span> / </span>
  //         <button onClick={() => navigate('/products')}>Products</button>
  //         <span> / </span>
  //         <span className="current">{product.name}</span>
  //       </div>
        
  //       {/* Product Container */}
  //       <div className="product-content">
  //         {/* Product Gallery */}
  //         <div className="product-gallery">
  //           <div className="main-image">
  //             <img 
  //               src={product.image_url || 'https://via.placeholder.com/600x600?text=No+Image'} 
  //               alt={product.name} 
  //               onError={(e) => {
  //                 e.target.onerror = null;
  //                 e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
  //               }}
  //             />
  //           </div>
            
  //           {product.additional_images && product.additional_images.length > 0 && (
  //             <div className="thumbnail-container">
  //               {[product.image_url, ...product.additional_images].map((img, index) => (
  //                 <div 
  //                   key={index} 
  //                   className={`thumbnail ${index === activeImage ? 'active' : ''}`}
  //                   onClick={() => setActiveImage(index)}
  //                 >
  //                   <img 
  //                     src={img} 
  //                     alt={`${product.name} view ${index + 1}`} 
  //                     onError={(e) => {
  //                       e.target.onerror = null;
  //                       e.target.src = 'https://via.placeholder.com/100x100?text=No+Img';
  //                     }}
  //                   />
  //                 </div>
  //               ))}
  //             </div>
  //           )}
  //         </div>
          
  //         {/* Product Information */}
  //         <div className="product-info">
  //           <div className="product-header">
  //             <h1>{product.name}</h1>
  //             <div className="product-rating">
  //               <div className="stars">
  //                 {'★'.repeat(Math.floor(product.rating || 4))}
  //                 {'☆'.repeat(5 - Math.floor(product.rating || 4))}
  //               </div>
  //               <span>{product.rating || 4.5} ({product.review_count || 0} reviews)</span>
  //             </div>
  //             <p className="product-description">{product.description}</p>
  //           </div>
            
  //           {/* Pricing Section */}
  //           <div className="pricing-section">
  //             <div className="price-display">
  //               <div className="current-price">${product.price.toFixed(2)}</div>
  //               {product.originalPrice > product.price && (
  //                 <div className="original-price">${product.originalPrice.toFixed(2)}</div>
  //               )}
  //             </div>
              
  //             {product.discount > 0 && (
  //               <div className="discount-badge">Save {product.discount}%</div>
  //             )}
  //           </div>
            
  //           {/* Offer Timer */}
  //           {product.discount > 0 && (
  //             <div className="offer-timer">
  //               <h3>Limited Time Offer</h3>
  //               <div className="timer-display">
  //                 <div className="time-unit">
  //                   <span>02</span>
  //                   <span>hr</span>
  //                 </div>
  //                 <div className="time-unit">
  //                   <span>30</span>
  //                   <span>min</span>
  //                 </div>
  //                 <div className="time-unit">
  //                   <span>45</span>
  //                   <span>sec</span>
  //                 </div>
  //               </div>
  //             </div>
  //           )}
            
  //           {/* Color Selection */}
  //           {product.colors && product.colors.length > 0 && (
  //             <div className="color-selection">
  //               <div className="selection-label">Color: <span className="selected-color">{selectedColor}</span></div>
  //               <div className="color-options">
  //                 {product.colors.map((color, index) => (
  //                   <button
  //                     key={index}
  //                     className={`color-option ${selectedColor === color ? 'selected' : ''}`}
  //                     style={{ backgroundColor: color.toLowerCase() }}
  //                     onClick={() => setSelectedColor(color)}
  //                     aria-label={`Select ${color} color`}
  //                   />
  //                 ))}
  //               </div>
  //             </div>
  //           )}
            
  //           {/* Quantity Selection */}
  //           <div className="quantity-selection">
  //             <div className="selection-label">Quantity:</div>
  //             <div className="quantity-control">
  //               <button onClick={decreaseQuantity} aria-label="Decrease quantity">-</button>
  //               <span>{quantity}</span>
  //               <button onClick={increaseQuantity} aria-label="Increase quantity">+</button>
  //             </div>
  //           </div>
            
  //           {/* Action Buttons */}
  //           <div className="action-buttons">
  //             <button className="buy-now-btn" onClick={handleBuyNow}>
  //               BUY NOW
  //             </button>
  //             <button className="add-to-cart-btn" onClick={handleAddToCart}>
  //               ADD TO CART
  //             </button>
  //           </div>
            
  //           {/* Product Stats */}
  //           <div className="product-stats">
  //             <div className="stat-item">
  //               <span className="stat-icon">🚚</span>
  //               <span>Free shipping on orders over $50</span>
  //             </div>
  //             <div className="stat-item">
  //               <span className="stat-icon">🔄</span>
  //               <span>30-day easy returns</span>
  //             </div>
  //             <div className="stat-item">
  //               <span className="stat-icon">🔒</span>
  //               <span>Secure checkout</span>
  //             </div>
  //           </div>
            
  //           {/* Product Features */}
  //           {product.features && product.features.length > 0 && (
  //             <div className="product-features">
  //               <h3>Key Features</h3>
  //               <ul>
  //                 {product.features.map((feature, index) => (
  //                   <li key={index}>
  //                     <span className="feature-icon">✓</span>
  //                     {feature}
  //                   </li>
  //                 ))}
  //               </ul>
  //             </div>
  //           )}
  //         </div>
  //       </div>
        
  //       {/* Product Specifications */}
  //       {product.specifications && (
  //         <div className="product-specifications">
  //           <h2>Product Specifications</h2>
  //           <div className="spec-grid">
  //             {Object.entries(product.specifications).map(([key, value], index) => (
  //               <div className="spec-item" key={index}>
  //                 <div className="spec-key">{key}</div>
  //                 <div className="spec-value">{value}</div>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  // export default ProductDetail;

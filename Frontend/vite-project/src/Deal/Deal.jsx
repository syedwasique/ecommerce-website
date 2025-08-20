import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import styles from './Deal.module.css';

const DealsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/deals');
        const data = await response.json();
        
        const processedProducts = data.map(product => ({
          ...product,
          price: Number(product.price) || Number(product.discount_price) || 0,
          originalPrice: Number(product.original_price) || 0,
          discountPercent: Number(product.discount_percent) || 0,
          release_date: new Date(),
          available_sizes: product.available_sizes || ['7', '8', '9', '10', '11', '12']
        }));
        
        setProducts(processedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching deals:', error);
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleAddToCart = (productId, size, price, e) => {
    e.stopPropagation();
    console.log(`Added deal product ${productId} (size ${size}) to cart at price $${price}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`, { state: { source: 'deals' } });
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Hot Deals</h1>
      <div className={styles.grid}>
        {products.map(product => (
          <div 
            key={product.id} 
            className={styles.wrapper}
            onClick={() => handleProductClick(product.id)}
          >
            <ProductCard 
              product={product}
              onAddToCart={handleAddToCart}
              source="deals"
              availableSizes={product.available_sizes}
            >
              <div className={styles.badge}>
                -{product.discountPercent}% OFF
              </div>
              
              <div className={styles.priceContainer}>
                <p className={styles.originalPrice}>
                  ${product.originalPrice.toFixed(2)}
                </p>
                <p className={styles.discountPrice}>
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </ProductCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsPage;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ProductCard from '../ProductCard/ProductCard';
// import './Deal.css';

// const DealsPage = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDeals = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/deals');
//         const data = await response.json();
        
//         const processedProducts = data.map(product => ({
//           ...product,
//           price: Number(product.discount_price) || 0,
//           // Updated property name
//           originalPrice: Number(product.base_price) || 0,
//           discountPercent: Number(product.discount_percent) || 0,
//           release_date: new Date()
//         }));
        
//         setProducts(processedProducts);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching deals:', error);
//         setLoading(false);
//       }
//     };

//     fetchDeals();
//   }, []);

//   const handleAddToCart = (productId, e) => {
//     e.stopPropagation();
//     console.log(`Added product ${productId} to cart`);
//   };

//   const handleProductClick = (productId) => {
//     navigate(`/product/${productId}`, { state: { source: 'deals' } });
//   };

//   if (loading) return <div className="loading">Loading...</div>;

//   return (
//     <div className="deals-page">
//       <h1>Hot Deals</h1>
//       <div className="products-grid">
//         {products.map(product => (
//           <div 
//             key={product.id} 
//             className="deal-product-wrapper"
//             onClick={() => handleProductClick(product.id)}
//           >
//             <ProductCard 
//               product={product}
//               onAddToCart={(e) => handleAddToCart(product.id, e)}
//               source="deals"
//             >
//               <div className="discount-badge">
//                 -{product.discountPercent}% OFF
//               </div>
              
//               <div className="price-container">
//                 <p className="original-price">
//                   ${product.originalPrice.toFixed(2)}
//                 </p>
//                 <p className="discount-price">
//                   ${product.price.toFixed(2)}
//                 </p>
//               </div>
//             </ProductCard>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DealsPage;













// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ProductCard from '../ProductCard/ProductCard';
// import './Deal.css';

// const DealsPage = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDeals = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/deals');
//         const data = await response.json();
        
//         const processedProducts = data.map(product => ({
//           ...product,
//           price: Number(product.discount_price) || 0,
//           originalPrice: Number(product.original_price) || 0,
//           discountPercent: Number(product.discount_percent) || 0,
//           release_date: new Date()
//         }));
        
//         setProducts(processedProducts);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching deals:', error);
//         setLoading(false);
//       }
//     };

//     fetchDeals();
//   }, []);

//   const handleAddToCart = (productId, e) => {
//     e.stopPropagation();
//     console.log(`Added product ${productId} to cart`);
//   };

//   const handleProductClick = (productId) => {
//     navigate(`/product/${productId}`, { state: { source: 'deals' } });
//   };

//   if (loading) return <div className="loading">Loading...</div>;

//   return (
//     <div className="deals-page">
//       <h1>Hot Deals</h1>
//       <div className="products-grid">
//         {products.map(product => (
//           <div 
//             key={product.id} 
//             className="deal-product-wrapper"
//             onClick={() => handleProductClick(product.id)}
//           >
//             <ProductCard 
//               product={product}
//               onAddToCart={(e) => handleAddToCart(product.id, e)}
//               source="deals"
//             >
//               <div className="discount-badge">
//                 -{product.discountPercent}% OFF
//               </div>
              
//               <div className="price-container">
//                 <p className="original-price">
//                   ${product.originalPrice.toFixed(2)}
//                 </p>
//                 <p className="discount-price">
//                   ${product.price.toFixed(2)}
//                 </p>
//               </div>
//             </ProductCard>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DealsPage;
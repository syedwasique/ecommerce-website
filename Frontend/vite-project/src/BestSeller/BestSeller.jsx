import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BestSeller.css';
import ProductCard from '../ProductCard/ProductCard';

const BestSellersPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  
  const categories = [
    { id: '1', name: 'Running' },
    { id: '2', name: 'Basketball' },
    { id: '3', name: 'Casual' },
    { id: '4', name: 'Training' },
    { id: '5', name: 'Outdoor' },
    { id: '6', name: 'Limited Edition' }
  ];

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('api/api/best-sellers');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch best sellers: ${response.status}`);
        }
        
        const data = await response.json();
        
        const processedProducts = data.map(product => ({
          ...product,
          price: convertToNumber(product.price),
          units_sold: convertToNumber(product.units_sold),
          release_date: new Date(product.release_date || Date.now()),
          available_sizes: product.available_sizes || ['7', '8', '9', '10', '11', '12']
        }));
        
        setProducts(processedProducts);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const convertToNumber = (value) => {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const handleAddToCart = (productId, size, price, e) => {
    e.stopPropagation();
    console.log(`Added best seller ${productId} (size ${size}) to cart at price $${price}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`, { state: { source: 'best_sellers' } });
  };

  const getSortedProducts = () => {
    let filtered = products;
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category_id == filterCategory);
    }
    
    switch (sortOption) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'oldest':
        return [...filtered].sort((a, b) => a.release_date - b.release_date);
      case 'newest':
      default:
        return [...filtered].sort((a, b) => b.release_date - a.release_date);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading best sellers...</p>
      </div>
    );
  }

  const sortedProducts = getSortedProducts();

  if (sortedProducts.length === 0) {
    return (
      <div className="no-products">
        <div className="empty-icon">👟</div>
        <h1>Best Sellers</h1>
        <p>No products found with the current filters.</p>
        <button className="retry-btn" onClick={() => {
          setFilterCategory('all');
          setSortOption('newest');
        }}>Reset Filters</button>
      </div>
    );
  }

  return (
    <div className="best-sellers-page">
      <div className="page-header">
        <h1>Best Sellers</h1>
        <p>Our most popular products based on sales</p>
      </div>
      
      <div className="controls">
        <div className="filter-section">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select 
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <div className="sort-section">
          <label htmlFor="sort-select">Sort by:</label>
          <select 
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
      
      <div className="products-grid">
        {sortedProducts.map(product => (
          <div 
            key={product.id} 
            className="bestseller-product-wrapper"
            onClick={() => handleProductClick(product.id)}
          >
            <ProductCard 
              product={product} 
              onAddToCart={handleAddToCart}
              source="best_sellers"
              availableSizes={product.available_sizes}
            >
              <div className="product-stats">
                <div className="sold-badge">
                  <span className="bold-text">Sold:</span> {product.units_sold.toLocaleString()} units
                </div>
              </div>
              
              <div className="best-seller-tag">BEST SELLER</div>
            </ProductCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellersPage;





// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './BestSeller.css';
// import ProductCard from '../ProductCard/ProductCard';

// const BestSellersPage = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [sortOption, setSortOption] = useState('newest');
  
//   const categories = [
//     { id: '1', name: 'Running' },
//     { id: '2', name: 'Basketball' },
//     { id: '3', name: 'Casual' },
//     { id: '4', name: 'Training' },
//     { id: '5', name: 'Outdoor' },
//     { id: '6', name: 'Limited Edition' }
//   ];

//   useEffect(() => {
//     const fetchBestSellers = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         const response = await fetch('api/api/best-sellers');
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch best sellers: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         const processedProducts = data.map(product => ({
//           ...product,
//           price: convertToNumber(product.price),
//           units_sold: convertToNumber(product.units_sold),
//           // Handle release_date consistently
//           release_date: new Date(product.release_date || Date.now())
//         }));
        
//         setProducts(processedProducts);
//       } catch (error) {
//         console.error('Error fetching best sellers:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBestSellers();
//   }, []);

//   const convertToNumber = (value) => {
//     if (value === null || value === undefined) return 0;
//     const num = Number(value);
//     return isNaN(num) ? 0 : num;
//   };

//   const handleAddToCart = (productId, e) => {
//     e.stopPropagation();
//     console.log(`Added product ${productId} to cart`);
//   };

//   const handleProductClick = (productId) => {
//     navigate(`/product/${productId}`, { state: { source: 'best_sellers' } });
//   };

//   // Apply sorting and filtering
//   const getSortedProducts = () => {
//     let filtered = products;
    
//     // Apply category filter
//     if (filterCategory !== 'all') {
//       filtered = filtered.filter(p => p.category_id == filterCategory);
//     }
    
//     // Apply sorting
//     switch (sortOption) {
//       case 'price-low':
//         return [...filtered].sort((a, b) => a.price - b.price);
//       case 'price-high':
//         return [...filtered].sort((a, b) => b.price - a.price);
//       case 'oldest':
//         return [...filtered].sort((a, b) => a.release_date - b.release_date);
//       case 'newest':
//       default:
//         return [...filtered].sort((a, b) => b.release_date - a.release_date);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading best sellers...</p>
//       </div>
//     );
//   }

//   const sortedProducts = getSortedProducts();

//   if (sortedProducts.length === 0) {
//     return (
//       <div className="no-products">
//         <div className="empty-icon">👟</div>
//         <h1>Best Sellers</h1>
//         <p>No products found with the current filters.</p>
//         <button className="retry-btn" onClick={() => {
//           setFilterCategory('all');
//           setSortOption('newest');
//         }}>Reset Filters</button>
//       </div>
//     );
//   }

//   return (
//     <div className="best-sellers-page">
//       <div className="page-header">
//         <h1>Best Sellers</h1>
//         <p>Our most popular products based on sales</p>
//       </div>
      
//       <div className="controls">
//         <div className="filter-section">
//           <label htmlFor="category-filter">Filter by Category:</label>
//           <select 
//             id="category-filter"
//             value={filterCategory}
//             onChange={(e) => setFilterCategory(e.target.value)}
//           >
//             <option value="all">All Categories</option>
//             {categories.map(category => (
//               <option key={category.id} value={category.id}>{category.name}</option>
//             ))}
//           </select>
//         </div>
        
//         <div className="sort-section">
//             <label htmlFor="sort-select">Sort by:</label>
//             <select 
//               id="sort-select"
//               value={sortOption}
//               onChange={(e) => setSortOption(e.target.value)}
//             >
//               <option value="newest">Newest First</option>
//               <option value="oldest">Oldest First</option>
//               <option value="price-low">Price: Low to High</option>
//               <option value="price-high">Price: High to Low</option>
//             </select>
//           </div>
//       </div>
      
//       <div className="products-grid">
//         {sortedProducts.map(product => (
//           <div 
//             key={product.id} 
//             className="bestseller-product-wrapper"
//             onClick={() => handleProductClick(product.id)}
//           >
//             <ProductCard 
//               product={product} 
//               onAddToCart={(e) => handleAddToCart(product.id, e)}
//               source="best_sellers"
//             >
//               <div className="product-stats">
//                 <div className="sold-badge">
//                   <span className="bold-text">Sold:</span> {product.units_sold.toLocaleString()} units
//                 </div>
//               </div>
              
//               <div className="best-seller-tag">BEST SELLER</div>
//             </ProductCard>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BestSellersPage;


















// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './BestSeller.css';
// import ProductCard from '../ProductCard/ProductCard';

// const BestSellersPage = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [sortOption, setSortOption] = useState('newest');
  
//   const categories = [
//     { id: '1', name: 'Running' },
//     { id: '2', name: 'Basketball' },
//     { id: '3', name: 'Casual' },
//     { id: '4', name: 'Training' },
//     { id: '5', name: 'Outdoor' },
//     { id: '6', name: 'Limited Edition' }
//   ];

//   useEffect(() => {
//     const fetchBestSellers = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         const response = await fetch('api/api/best-sellers');
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch best sellers: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         const processedProducts = data.map(product => ({
//           ...product,
//           price: convertToNumber(product.price),
//           units_sold: convertToNumber(product.units_sold),
//           release_date: new Date(product.release_date || Date.now())
//         }));
        
//         setProducts(processedProducts);
//       } catch (error) {
//         console.error('Error fetching best sellers:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBestSellers();
//   }, []);

//   const convertToNumber = (value) => {
//     if (value === null || value === undefined) return 0;
//     const num = Number(value);
//     return isNaN(num) ? 0 : num;
//   };

//   const handleAddToCart = (productId, e) => {
//     e.stopPropagation();
//     console.log(`Added product ${productId} to cart`);
//   };

//   const handleProductClick = (productId) => {
//     navigate(`/product/${productId}`, { state: { source: 'best_sellers' } });
//   };

//   // Apply sorting and filtering
//   const getSortedProducts = () => {
//     let filtered = products;
    
//     // Apply category filter
//     if (filterCategory !== 'all') {
//       filtered = filtered.filter(p => p.category_id == filterCategory);
//     }
    
//     // Apply sorting
//     switch (sortOption) {
//       case 'price-low':
//         return [...filtered].sort((a, b) => a.price - b.price);
//       case 'price-high':
//         return [...filtered].sort((a, b) => b.price - a.price);
//       case 'oldest':
//         return [...filtered].sort((a, b) => a.release_date - b.release_date);
//       case 'newest':
//       default:
//         return [...filtered].sort((a, b) => b.release_date - a.release_date);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading best sellers...</p>
//       </div>
//     );
//   }

//   const sortedProducts = getSortedProducts();

//   if (sortedProducts.length === 0) {
//     return (
//       <div className="no-products">
//         <div className="empty-icon">👟</div>
//         <h1>Best Sellers</h1>
//         <p>No products found with the current filters.</p>
//         <button className="retry-btn" onClick={() => {
//           setFilterCategory('all');
//           setSortOption('newest');
//         }}>Reset Filters</button>
//       </div>
//     );
//   }

//   return (
//     <div className="best-sellers-page">
//       <div className="page-header">
//         <h1>Best Sellers</h1>
//         <p>Our most popular products based on sales</p>
//       </div>
      
//       <div className="controls">
//         <div className="filter-section">
//           <label htmlFor="category-filter">Filter by Category:</label>
//           <select 
//             id="category-filter"
//             value={filterCategory}
//             onChange={(e) => setFilterCategory(e.target.value)}
//           >
//             <option value="all">All Categories</option>
//             {categories.map(category => (
//               <option key={category.id} value={category.id}>{category.name}</option>
//             ))}
//           </select>
//         </div>
        
//         <div className="sort-section">
//             <label htmlFor="sort-select">Sort by:</label>
//             <select 
//               id="sort-select"
//               value={sortOption}
//               onChange={(e) => setSortOption(e.target.value)}
//             >
//               <option value="newest">Newest First</option>
//               <option value="oldest">Oldest First</option>
//               <option value="price-low">Price: Low to High</option>
//               <option value="price-high">Price: High to Low</option>
//             </select>
//           </div>
//       </div>
      
//       <div className="products-grid">
//         {sortedProducts.map(product => (
//           <div 
//             key={product.id} 
//             className="bestseller-product-wrapper"
//             onClick={() => handleProductClick(product.id)}
//           >
//             <ProductCard 
//               product={product} 
//               onAddToCart={(e) => handleAddToCart(product.id, e)}
//               source="best_sellers"
//             >
//               <div className="product-stats">
//                 <div className="sold-badge">
//                   <span className="bold-text">Sold:</span> {product.units_sold.toLocaleString()} units
//                 </div>
//               </div>
              
//               <div className="best-seller-tag">BEST SELLER</div>
//             </ProductCard>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BestSellersPage;


































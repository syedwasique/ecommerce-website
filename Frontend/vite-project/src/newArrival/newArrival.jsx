
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import api from "../api";
import './new.css';

const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
  const response = await api.get("/api/new-arrivals");
const data = response.data; // axios automatically parses JSON

        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
       
        
        const processedData = data.map(product => ({
          ...product,
          price: parseFloat(product.price) || 0,
          release_date: new Date(product.release_date),
          available_sizes: product.available_sizes || ['7', '8', '9', '10', '11', '12']
        }));
        
        setProducts(processedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // Handle add to cart
  const handleAddToCart = (productId, size, price, e) => {
    e.stopPropagation();
    console.log(`Added product ${productId} (size ${size}) to cart at price $${price}`);
    // In a real app, you would dispatch an action to your cart store
  };

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Apply sorting and filtering
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
        <p>Loading new arrivals...</p>
      </div>
    );
  }

  const sortedProducts = getSortedProducts();

  return (
    <div className="new-arrivals-page">
      <div className="header-section">
        <h1>New Arrivals</h1>
        <p className="subtitle">Discover our latest premium footwear collection</p>
        
        <div className="controls">
          <div className="filter-section">
            <label htmlFor="category-filter">Filter by Category:</label>
            <select 
              id="category-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="1">Running</option>
              <option value="2">Basketball</option>
              <option value="3">Casual</option>
              <option value="4">Training</option>
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
      </div>
      
      {sortedProducts.length === 0 ? (
        <div className="no-products">
          <div className="empty-icon">👟</div>
          <h2>No new arrivals found</h2>
          <p>Try changing your filters or check back later</p>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map(product => (
            <div 
              key={product.id} 
              className="product-card-wrapper"
              onClick={() => handleProductClick(product.id)}
            >
              <ProductCard 
                product={product} 
                onAddToCart={handleAddToCart}
                availableSizes={product.available_sizes}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrivalsPage;









// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ProductCard from '../ProductCard/ProductCard';
// import './new.css';

// const NewArrivalsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortOption, setSortOption] = useState('newest');
//   const [filterCategory, setFilterCategory] = useState('all');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchNewArrivals = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('api/api/new-arrivals');
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         const processedData = data.map(product => ({
//           ...product,
//           price: parseFloat(product.price) || 0,
//           release_date: new Date(product.release_date)
//         }));
        
//         setProducts(processedData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching new arrivals:', error);
//         setLoading(false);
//       }
//     };

//     fetchNewArrivals();
//   }, []);

//   // Handle add to cart
//   const handleAddToCart = (productId, e) => {
//     e.stopPropagation();
//     console.log(`Added product ${productId} to cart`);
//     // In a real app, you would dispatch an action to your cart store
//   };

//   // Handle product click
//   const handleProductClick = (productId) => {
//     navigate(`/product/${productId}`);
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
//         <p>Loading new arrivals...</p>
//       </div>
//     );
//   }

//   const sortedProducts = getSortedProducts();

//   return (
//     <div className="new-arrivals-page">
//       <div className="header-section">
//         <h1>New Arrivals</h1>
//         <p className="subtitle">Discover our latest premium footwear collection</p>
        
//         <div className="controls">
//           <div className="filter-section">
//             <label htmlFor="category-filter">Filter by Category:</label>
//             <select 
//               id="category-filter"
//               value={filterCategory}
//               onChange={(e) => setFilterCategory(e.target.value)}
//             >
//               <option value="all">All Categories</option>
//               <option value="1">Running</option>
//               <option value="2">Basketball</option>
//               <option value="3">Casual</option>
//               <option value="4">Training</option>
//             </select>
//           </div>
          
//           <div className="sort-section">
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
//         </div>
//       </div>
      
//       {sortedProducts.length === 0 ? (
//         <div className="no-products">
//           <div className="empty-icon">👟</div>
//           <h2>No new arrivals found</h2>
//           <p>Try changing your filters or check back later</p>
//         </div>
//       ) : (
//         <div className="products-grid">
//           {sortedProducts.map(product => (
//             <div 
//               key={product.id} 
//               className="product-card-wrapper"
//               onClick={() => handleProductClick(product.id)}
//             >
//               <ProductCard 
//                 product={product} 
//                 onAddToCart={(e) => handleAddToCart(product.id, e)}
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewArrivalsPage;




















// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ProductCard from '../ProductCard/ProductCard';
// import './new.css';

// const NewArrivalsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortOption, setSortOption] = useState('newest');
//   const [filterCategory, setFilterCategory] = useState('all');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchNewArrivals = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('api/api/new-arrivals');
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         const processedData = data.map(product => ({
//           ...product,
//           price: parseFloat(product.price) || 0,
//           release_date: new Date(product.release_date)
//         }));
        
//         setProducts(processedData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching new arrivals:', error);
//         setLoading(false);
//       }
//     };

//     fetchNewArrivals();
//   }, []);

//   // Handle add to cart
//   const handleAddToCart = (productId, e) => {
//     e.stopPropagation();
//     console.log(`Added product ${productId} to cart`);
//     // In a real app, you would dispatch an action to your cart store
//   };

//   // Handle product click
//   const handleProductClick = (productId) => {
//     navigate(`/product/${productId}`);
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
//         <p>Loading new arrivals...</p>
//       </div>
//     );
//   }

//   const sortedProducts = getSortedProducts();

//   return (
//     <div className="new-arrivals-page">
//       <div className="header-section">
//         <h1>New Arrivals</h1>
//         <p className="subtitle">Discover our latest premium footwear collection</p>
        
//         <div className="controls">
//           <div className="filter-section">
//             <label htmlFor="category-filter">Filter by Category:</label>
//             <select 
//               id="category-filter"
//               value={filterCategory}
//               onChange={(e) => setFilterCategory(e.target.value)}
//             >
//               <option value="all">All Categories</option>
//               <option value="1">Running</option>
//               <option value="2">Basketball</option>
//               <option value="3">Casual</option>
//               <option value="4">Training</option>
//             </select>
//           </div>
          
//           <div className="sort-section">
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
//         </div>
//       </div>
      
//       {sortedProducts.length === 0 ? (
//         <div className="no-products">
//           <div className="empty-icon">👟</div>
//           <h2>No new arrivals found</h2>
//           <p>Try changing your filters or check back later</p>
//         </div>
//       ) : (
//         <div className="products-grid">
//           {sortedProducts.map(product => (
//             <div 
//               key={product.id} 
//               className="product-card-wrapper"
//               onClick={() => handleProductClick(product.id)}
//             >
//               <ProductCard 
//                 product={product} 
//                 onAddToCart={(e) => handleAddToCart(product.id, e)}
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewArrivalsPage;





import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './categoryP.css';
import ProductCard from '../ProductCard/ProductCard';


const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('featured');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch category details
        const categoryRes = await fetch(`api/api/categories/${categoryId}`);
        if (!categoryRes.ok) {
          throw new Error(`Category not found (${categoryRes.status})`);
        }
        const categoryData = await categoryRes.json();
        
        // Handle both array and object responses
        let currentCategory = null;
        if (Array.isArray(categoryData)) {
          currentCategory = categoryData[0] || null;
        } else {
          currentCategory = categoryData;
        }
        
        setCategory(currentCategory);
        
        // Fetch products
        const productsRes = await fetch(`api/api/category/${categoryId}`);
        
        if (!productsRes.ok) {
          const errorText = await productsRes.text();
          throw new Error(`Products error: ${productsRes.status} - ${errorText.slice(0, 100)}`);
        }
        
        const productsData = await productsRes.json();
        
        // Enrich products with category name and available sizes
        const enrichedProducts = currentCategory
          ? productsData.map(product => ({
              ...product,
              category_name: currentCategory.name,
              productType: product.type || product.source || '',
              available_sizes: product.available_sizes || ['7', '8', '9', '10', '11', '12']
            }))
          : productsData.map(product => ({
              ...product,
              productType: product.type || product.source || '',
              available_sizes: product.available_sizes || ['7', '8', '9', '10', '11', '12']
            }));
            
        setProducts(enrichedProducts);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  // Handle sorting
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    // In a real app, you would sort the products here
  };

  // Safe type formatter
  const formatProductType = (type) => {
    if (!type) return '';
    return String(type).replace('_', ' ').replace('-', ' ');
  };

  // Handle add to cart with size selection
  const handleAddToCart = (productId, size, price, e) => {
    e.stopPropagation();
    console.log(`Added product ${productId} (size ${size}) to cart at price $${price}`);
    // In a real app, dispatch to cart store
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Products</h2>
        <p className="error-message">{error}</p>
        
        <div className="action-buttons">
          <button onClick={() => window.location.reload()} className="retry-button">
            Reload Page
          </button>
          <button onClick={() => navigate('/categories')} className="back-button">
            Browse Categories
          </button>
        </div>
        
        <p className="contact-support">
          Still having issues? Contact support at support@solehub.com
        </p>
      </div>
    );
  }

  return (
    <div className="category-products-page">
      {category ? (
        <div className="category-header">
          <div className="breadcrumb">
            <span onClick={() => navigate('/')}>Home</span> / 
            <span onClick={() => navigate('/categories')}> Categories</span> / 
            <span className="current-category"> {category.name}</span>
          </div>
          
          <div className="header-content">
            <div className="text-content">
              <h1>{category.name}</h1>
              <p className="category-description">{category.description}</p>
            </div>
            
            {category.image_url && (
              <div 
                className="category-banner"
                style={{ backgroundImage: `url(${category.image_url})` }}
              ></div>
            )}
          </div>
          
          <div className="controls-bar">
            <div className="results-count">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </div>
            
            <div className="sort-options">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select" 
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <h1>Category Products</h1>
      )}
      
      {products.length === 0 ? (
        <div className="no-products">
          <div className="empty-state">
            <div className="empty-icon">👟</div>
            <h2>No products found in this category</h2>
            <p>We couldn't find any products matching this category.</p>
            <button onClick={() => navigate('/categories')} className="back-button">
              Browse Other Categories
            </button>
          </div>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={`${product.productType}-${product.id}`} 
              product={product}
              onAddToCart={handleAddToCart}
              availableSizes={product.available_sizes}
              children={
                <div className="product-meta">
                  <div className="additional-info">
                    {product.units_sold !== undefined && (
                      <p className="units-sold">
                        <span className="icon">🔥</span> {product.units_sold.toLocaleString()} sold
                      </p>
                    )}
                    
                    {product.release_date && (
                      <p className="release-date">
                        <span className="icon">📅</span> {new Date(product.release_date).toLocaleDateString()}
                      </p>
                    )}
                    
                    {product.productType && (
                      <p className="product-type">{formatProductType(product.productType)}</p>
                    )}
                  </div>
                </div>
              }
            />
          ))}
        </div>
      )}
      
      {products.length > 0 && (
        <div className="pagination-controls">
          <button className="pagination-btn">← Previous</button>
          <span className="page-info">Page 1 of 3</span>
          <button className="pagination-btn">Next →</button>
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;




// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './categoryP.css';
// import ProductCard from '../ProductCard/ProductCard';

// const CategoryProductsPage = () => {
//   const { categoryId } = useParams();
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [category, setCategory] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortOption, setSortOption] = useState('featured');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Fetch category details
//         const categoryRes = await fetch(`api/api/categories/${categoryId}`);
//         if (!categoryRes.ok) {
//           throw new Error(`Category not found (${categoryRes.status})`);
//         }
//         const categoryData = await categoryRes.json();
        
//         // Handle both array and object responses
//         let currentCategory = null;
//         if (Array.isArray(categoryData)) {
//           currentCategory = categoryData[0] || null;
//         } else {
//           currentCategory = categoryData;
//         }
        
//         setCategory(currentCategory);
        
//         // Fetch products
//         const productsRes = await fetch(`api/api/category/${categoryId}`);
        
//         if (!productsRes.ok) {
//           const errorText = await productsRes.text();
//           throw new Error(`Products error: ${productsRes.status} - ${errorText.slice(0, 100)}`);
//         }
        
//         const productsData = await productsRes.json();
        
//         // Enrich products with category name
//         const enrichedProducts = currentCategory
//           ? productsData.map(product => ({
//               ...product,
//               category_name: currentCategory.name,
//               // Add safe type property
//               productType: product.type || product.source || ''
//             }))
//           : productsData.map(product => ({
//               ...product,
//               productType: product.type || product.source || ''
//             }));
            
//         setProducts(enrichedProducts);
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [categoryId]);

//   // Handle sorting
//   const handleSortChange = (e) => {
//     setSortOption(e.target.value);
//     // In a real app, you would sort the products here
//   };

//   // Safe type formatter
//   const formatProductType = (type) => {
//     if (!type) return '';
//     return String(type).replace('_', ' ').replace('-', ' ');
//   };

//   if (loading) {
//     return (
//       <div className="loading">
//         <div className="spinner"></div>
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error">
//         <h2>Error Loading Products</h2>
//         <p className="error-message">{error}</p>
        
//         <div className="action-buttons">
//           <button onClick={() => window.location.reload()} className="retry-button">
//             Reload Page
//           </button>
//           <button onClick={() => navigate('/categories')} className="back-button">
//             Browse Categories
//           </button>
//         </div>
        
//         <p className="contact-support">
//           Still having issues? Contact support at support@solehub.com
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="category-products-page">
//       {category ? (
//         <div className="category-header">
//           <div className="breadcrumb">
//             <span onClick={() => navigate('/')}>Home</span> / 
//             <span onClick={() => navigate('/categories')}> Categories</span> / 
//             <span className="current-category"> {category.name}</span>
//           </div>
          
//           <div className="header-content">
//             <div className="text-content">
//               <h1>{category.name}</h1>
//               <p className="category-description">{category.description}</p>
//             </div>
            
//             {category.image_url && (
//               <div 
//                 className="category-banner"
//                 style={{ backgroundImage: `url(${category.image_url})` }}
//               ></div>
//             )}
//           </div>
          
//           <div className="controls-bar">
//             <div className="results-count">
//               {products.length} {products.length === 1 ? 'product' : 'products'} found
//             </div>
            
//             <div className="sort-options">
//               <label htmlFor="sort-select">Sort by:</label>
//               <select 
//                 id="sort-select" 
//                 value={sortOption}
//                 onChange={handleSortChange}
//               >
//                 <option value="featured">Featured</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//                 <option value="newest">Newest Arrivals</option>
//                 <option value="popular">Most Popular</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <h1>Category Products</h1>
//       )}
      
//       {products.length === 0 ? (
//         <div className="no-products">
//           <div className="empty-state">
//             <div className="empty-icon">👟</div>
//             <h2>No products found in this category</h2>
//             <p>We couldn't find any products matching this category.</p>
//             <button onClick={() => navigate('/categories')} className="back-button">
//               Browse Other Categories
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="products-grid">
//           {products.map(product => (
//             <ProductCard 
//               key={`${product.productType}-${product.id}`} 
//               product={product}
//               // Pass additional product info as children
//               children={
//                 <div className="product-meta">
//                   <div className="additional-info">
//                     {product.units_sold !== undefined && (
//                       <p className="units-sold">
//                         <span className="icon">🔥</span> {product.units_sold.toLocaleString()} sold
//                       </p>
//                     )}
                    
//                     {product.release_date && (
//                       <p className="release-date">
//                         <span className="icon">📅</span> {new Date(product.release_date).toLocaleDateString()}
//                       </p>
//                     )}
                    
//                     {product.productType && (
//                       <p className="product-type">{formatProductType(product.productType)}</p>
//                     )}
//                   </div>
//                 </div>
//               }
//             />
//           ))}
//         </div>
//       )}
      
//       {products.length > 0 && (
//         <div className="pagination-controls">
//           <button className="pagination-btn">← Previous</button>
//           <span className="page-info">Page 1 of 3</span>
//           <button className="pagination-btn">Next →</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoryProductsPage;








// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './categoryP.css';
// import ProductCard from '../ProductCard/ProductCard';

// const CategoryProductsPage = () => {
//   const { categoryId } = useParams();
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [category, setCategory] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortOption, setSortOption] = useState('featured');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Fetch category details
//         const categoryRes = await fetch(`api/api/categories/${categoryId}`);
//         if (!categoryRes.ok) {
//           throw new Error(`Category not found (${categoryRes.status})`);
//         }
//         const categoryData = await categoryRes.json();
        
//         // FIX: Handle both array and object responses
//         let currentCategory = null;
//         if (Array.isArray(categoryData)) {
//           currentCategory = categoryData[0] || null;
//         } else {
//           currentCategory = categoryData;
//         }
        
//         setCategory(currentCategory);
        
//         // Fetch products
//         const productsRes = await fetch(`api/api/category/${categoryId}`);
        
//         if (!productsRes.ok) {
//           const errorText = await productsRes.text();
//           throw new Error(`Products error: ${productsRes.status} - ${errorText.slice(0, 100)}`);
//         }
        
//         const productsData = await productsRes.json();
        
//         // Enrich products with category name
//         const enrichedProducts = currentCategory
//           ? productsData.map(product => ({
//               ...product,
//               category_name: currentCategory.name
//             }))
//           : productsData;
          
//         setProducts(enrichedProducts);
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [categoryId]);

//   // Handle sorting
//   const handleSortChange = (e) => {
//     setSortOption(e.target.value);
//     // In a real app, you would sort the products here
//   };

//   if (loading) {
//     return (
//       <div className="loading">
//         <div className="spinner"></div>
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error">
//         <h2>Error Loading Products</h2>
//         <p className="error-message">{error}</p>
        
//         <div className="action-buttons">
//           <button onClick={() => window.location.reload()} className="retry-button">
//             Reload Page
//           </button>
//           <button onClick={() => navigate('/categories')} className="back-button">
//             Browse Categories
//           </button>
//         </div>
        
//         <p className="contact-support">
//           Still having issues? Contact support at support@solehub.com
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="category-products-page">
//       {category ? (
//         <div className="category-header">
//           <div className="breadcrumb">
//             <span onClick={() => navigate('/')}>Home</span> / 
//             <span onClick={() => navigate('/categories')}> Categories</span> / 
//             <span className="current-category"> {category.name}</span>
//           </div>
          
//           <div className="header-content">
//             <div className="text-content">
//               <h1>{category.name}</h1>
//               <p className="category-description">{category.description}</p>
//             </div>
            
//             {category.image_url && (
//               <div 
//                 className="category-banner"
//                 style={{ backgroundImage: `url(${category.image_url})` }}
//               ></div>
//             )}
//           </div>
          
//           <div className="controls-bar">
//             <div className="results-count">
//               {products.length} {products.length === 1 ? 'product' : 'products'} found
//             </div>
            
//             <div className="sort-options">
//               <label htmlFor="sort-select">Sort by:</label>
//               <select 
//                 id="sort-select" 
//                 value={sortOption}
//                 onChange={handleSortChange}
//               >
//                 <option value="featured">Featured</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//                 <option value="newest">Newest Arrivals</option>
//                 <option value="popular">Most Popular</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <h1>Category Products</h1>
//       )}
      
//       {products.length === 0 ? (
//         <div className="no-products">
//           <div className="empty-state">
//             <div className="empty-icon">👟</div>
//             <h2>No products found in this category</h2>
//             <p>We couldn't find any products matching this category.</p>
//             <button onClick={() => navigate('/categories')} className="back-button">
//               Browse Other Categories
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="products-grid">
//           {products.map(product => (
//             <ProductCard 
//               key={`${product.type}-${product.id}`} 
//               product={product}
//               // Pass additional product info as children
//               children={
//                 <div className="product-meta">
//                   <div className="additional-info">
//                     {product.type === 'best_sellers' && product.units_sold !== undefined && (
//                       <p className="units-sold">
//                         <span className="icon">🔥</span> {product.units_sold.toLocaleString()} sold
//                       </p>
//                     )}
                    
//                     {product.type === 'new_arrivals' && product.release_date && (
//                       <p className="release-date">
//                         <span className="icon">📅</span> {new Date(product.release_date).toLocaleDateString()}
//                       </p>
//                     )}
                    
//                     <p className="product-type">{product.type.replace('_', ' ')}</p>
//                   </div>
//                 </div>
//               }
//             />
//           ))}
//         </div>
//       )}
      
//       {products.length > 0 && (
//         <div className="pagination-controls">
//           <button className="pagination-btn">← Previous</button>
//           <span className="page-info">Page 1 of 3</span>
//           <button className="pagination-btn">Next →</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoryProductsPage;
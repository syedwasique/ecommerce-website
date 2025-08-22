import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import RandomProducts from '../randomproducts/randomPro';
import styles from './home.module.css';

const HomePage = ({ categories }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const location = useLocation();

  // Hero background images
  const heroImages = [
    'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1543508282-6319a3e2621f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1915&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=1925&q=80',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80'
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [arrivalsRes, bestRes, dealsRes] = await Promise.all([
          fetch('api/api/new-arrivals?limit=5'),
          fetch('api/api/best-sellers?limit=5'),
          fetch('api/api/deals?limit=5')
        ]);

        const arrivalsData = await arrivalsRes.json();
        const bestData = await bestRes.json();
        const dealsData = await dealsRes.json();

        const allProducts = [
          ...arrivalsData.map(item => ({
            ...item,
            price: Number(item.price),
            type: 'new-arrival',
            features: [
              { icon: 'fa-bolt', text: 'Lightweight' },
              { icon: 'fa-cloud', text: 'Breathable' },
              { icon: 'fa-star', text: 'New Design' }
            ]
          })),
          ...bestData.map(item => ({
            ...item,
            price: Number(item.price),
            type: 'best-seller',
            features: [
              { icon: 'fa-medal', text: 'Best Seller' },
              { icon: 'fa-heart', text: 'Most Loved' },
              { icon: 'fa-award', text: 'Premium' }
            ]
          })),
          ...dealsData.map(item => ({
            ...item,
            original_price: Number(item.original_price),
            discount_price: Number(item.discount_price),
            type: 'deal',
            features: [
              { icon: 'fa-percentage', text: 'Limited Offer' },
              { icon: 'fa-clock', text: 'Ending Soon' },
              { icon: 'fa-tag', text: 'Discounted' }
            ]
          }))
        ];
        
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 10));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching home data:', error);
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [location.key]);

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading styles...</p>
    </div>
  );

  return (
    <div className={styles.homePage}>
      {/* Hero Section with Slider */}
      <section className={styles.heroSection}>
        <div className={styles.sliderContainer}>
          {heroImages.map((image, index) => (
            <div 
              key={index}
              className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
              style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${image})` }}
            />
          ))}
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>ELEVATE YOUR STEP</h1>
            <p className={styles.heroSubtitle}>Premium footwear crafted for comfort and style</p>
            <div className={styles.heroCta}>
              <Link to="/new-arrivals" className={`${styles.ctaButton} ${styles.primary}`}>SHOP COLLECTION</Link>
             <Link to="/categories" className={`${styles.ctaButton} ${styles.secondary}`}>VIEW LOOKBOOK</Link>  
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <RandomProducts products={featuredProducts} loading={loading} />

      {/* Promo Banner */}
      <section className={styles.promoBanner}>
        <div className={styles.bannerContent}>
          <h2 className={styles.bannerTitle}>SUMMER COLLECTION</h2>
          <p className={styles.bannerSubtitle}>Limited edition styles with free shipping</p>
          <Link to="/deals" className={styles.bannerButton}>SHOP NOW</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h3 className={styles.footerLogo}>SOLE<span>HUB</span></h3>
            <p className={styles.footerTagline}>Redefining modern footwear</p>
          </div>
          
          <div className={styles.footerGrid}>
            <div className={styles.footerColumn}>
              <h4>Explore</h4>
              <Link to="/">Home</Link>
              <Link to="/new-arrivals">New Arrivals</Link>
              <Link to="/best-sellers">Collections</Link>
              <Link to="/deals">Special Offers</Link>
            </div>
            
            <div className={styles.footerColumn}>
              <h4>Support</h4>
              <Link to="/contact">Contact Us</Link>
              <Link to="/faq">FAQs</Link>
              <Link to="/shipping">Shipping</Link>
              <Link to="/returns">Returns</Link>
            </div>
            
            <div className={styles.footerColumn}>
              <h4>Company</h4>
              <Link to="/about">Our Story</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} SoleHub. All rights reserved.</p>
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;















// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import RandomProducts from '../randomproducts/randomPro';
// import './home.css';

// const HomePage = ({ categories }) => {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchHomeData = async () => {
//       try {
//         const [arrivalsRes, bestRes, dealsRes] = await Promise.all([
//           fetch('api/api/new-arrivals?limit=5'),
//           fetch('api/api/best-sellers?limit=5'),
//           fetch('api/api/deals?limit=5')
//         ]);

//         const arrivalsData = await arrivalsRes.json();
//         const bestData = await bestRes.json();
//         const dealsData = await dealsRes.json();

//         const allProducts = [
//           ...arrivalsData.map(item => ({
//             ...item,
//             price: Number(item.price),
//             type: 'new-arrival',
//             features: [
//               { icon: 'fa-bolt', text: 'Lightweight' },
//               { icon: 'fa-cloud', text: 'Breathable' },
//               { icon: 'fa-star', text: 'New Design' }
//             ]
//           })),
//           ...bestData.map(item => ({
//             ...item,
//             price: Number(item.price),
//             type: 'best-seller',
//             features: [
//               { icon: 'fa-medal', text: 'Best Seller' },
//               { icon: 'fa-heart', text: 'Most Loved' },
//               { icon: 'fa-award', text: 'Premium' }
//             ]
//           })),
//           ...dealsData.map(item => ({
//             ...item,
//             original_price: Number(item.original_price),
//             discount_price: Number(item.discount_price),
//             type: 'deal',
//             features: [
//               { icon: 'fa-percentage', text: 'Limited Offer' },
//               { icon: 'fa-clock', text: 'Ending Soon' },
//               { icon: 'fa-tag', text: 'Discounted' }
//             ]
//           }))
//         ];
        
//         const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
//         setFeaturedProducts(shuffled.slice(0, 10));
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching home data:', error);
//         setLoading(false);
//       }
//     };

//     fetchHomeData();
//   }, [location.key]);

//   if (loading) return (
//     <div className="loading-container">
//       <div className="loading-spinner"></div>
//       <p>Loading styles...</p>
//     </div>
//   );

//   return (
//     <div className="home-page">
//       {/* Minimalist floating elements */}
//       <div className="floating-elements">
//         <div className="floating-circle"></div>
//         <div className="floating-square"></div>
//       </div>

//       {/* Elegant Hero Section */}
//       <section className="hero-section">
//         <div className="hero-overlay"></div>
//         <div className="hero-content">
//           <div className="hero-text">
//             <h1 className="hero-title">ELEVATE YOUR STEP</h1>
//             <p className="hero-subtitle">Where craftsmanship meets contemporary design</p>
//             <div className="hero-cta">
//               <Link to="/new-arrivals" className="cta-button primary">SHOP COLLECTION</Link>
//               <Link to="/collections" className="cta-button secondary">VIEW LOOKBOOK</Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Featured Products Section */}
//       <RandomProducts products={featuredProducts} loading={loading} />

//       {/* Luxe Promo Banner */}
//       <section className="banner-section">
//         <div className="banner-overlay"></div>
//         <div className="banner-content">
//           <h2 className="banner-title">SUMMER EDIT</h2>
//           <p className="banner-subtitle">Exclusive styles with complimentary shipping</p>
//           <Link to="/deals" className="banner-button">DISCOVER OFFERS</Link>
//         </div>
//       </section>

//       {/* Minimalist Footer */}
//       <footer className="footer">
//         <div className="footer-content">
//           <div className="footer-brand">
//             <h3 className="footer-logo">SOLE<span>STUDIO</span></h3>
//             <p className="footer-tagline">Redefining footwear elegance</p>
//           </div>
          
//           <div className="footer-grid">
//             <div className="footer-column">
//               <h4>Explore</h4>
//               <Link to="/">Home</Link>
//               <Link to="/new-arrivals">New Arrivals</Link>
//               <Link to="/best-sellers">Collections</Link>
//               <Link to="/deals">Limited Editions</Link>
//             </div>
            
//             <div className="footer-column">
//               <h4>Assistance</h4>
//               <Link to="/contact">Concierge</Link>
//               <Link to="/faq">Style Advice</Link>
//               <Link to="/shipping">Delivery</Link>
//               <Link to="/returns">Returns</Link>
//             </div>
            
//             <div className="footer-column">
//               <h4>Atelier</h4>
//               <Link to="/about">Our Craft</Link>
//               <Link to="/careers">Artisans</Link>
//               <Link to="/privacy">Confidentiality</Link>
//               <Link to="/terms">Terms</Link>
//             </div>
            
            
//           </div>
//         </div>
        
//         <div className="footer-bottom">
//           <p>© {new Date().getFullYear()} SoleStudio. All rights reserved.</p>
//           <div className="social-links">
//             <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
//             <a href="#" aria-label="Pinterest"><i className="fab fa-pinterest"></i></a>
//             <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;
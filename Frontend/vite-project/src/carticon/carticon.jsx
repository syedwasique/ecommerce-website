// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useCart } from '../cartcontext/cartcontext';
// import styles from './CartIcon.module.css';

// const CartIcon = () => {
//   const { cartCount } = useCart();
  
//   return (
//     <Link to="/cart" className={styles.cartIcon}>
//       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <circle cx="9" cy="21" r="1"></circle>
//         <circle cx="20" cy="21" r="1"></circle>
//         <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
//       </svg>
//       {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
//     </Link>
//   );
// };

// export default CartIcon;

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../cartcontext/cartcontext';
import { useAuth } from '../Authcontext';
import styles from './CartIcon.module.css';

const CartIcon = () => {
  const { cartCount, isAuthenticated } = useCart(); // Removed updateAuthStatus from here
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Removed the useEffect that was trying to use updateAuthStatus
  // Authentication status is now handled by the AuthContext alone

  const handleCartClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      navigate('/login', {
        state: {
          message: 'Please login to view your cart',
          returnUrl: '/cart'
        }
      });
    }
  };

  // Don't show cart icon if not authenticated
  if (!currentUser) return null; // Changed from isAuthenticated to currentUser

  return (
    <Link 
      to="/cart" 
      className={styles.cartIcon}
      onClick={handleCartClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
    </Link>
  );
};

export default CartIcon;
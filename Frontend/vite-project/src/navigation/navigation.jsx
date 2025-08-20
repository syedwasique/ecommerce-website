import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authcontext';
import CartIcon from '../carticon/carticon';
import styles from './navigation.module.css'; 

const NavBar = ({ categories }) => {
  const { currentUser, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownClosing, setDropdownClosing] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest(`.${styles.userDropdown}`)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    if (dropdownOpen) {
      closeDropdown();
    } else {
      setDropdownOpen(true);
      setDropdownClosing(false);
    }
  };

  const closeDropdown = () => {
    setDropdownClosing(true);
    setTimeout(() => {
      setDropdownOpen(false);
      setDropdownClosing(false);
    }, 200); // Match this with your CSS transition duration
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeDropdown();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <nav className={styles.mainNav}>
        <div className={styles.navLoading}>Loading...</div>
      </nav>
    );
  }

  return (
    <nav className={styles.mainNav}>
      <Link to="/" className={styles.logo}>SOLE<span>HUB</span></Link>
      <div className={styles.navLinks}>
        <Link to="/">Home</Link>
        <Link to="/new-arrivals">New Arrivals</Link>
        <Link to="/best-sellers">Best Sellers</Link>
        <Link to="/deals">Deals</Link>
        <Link to="/categories">Categories</Link>
        
        {currentUser ? (
          <div className={styles.userSection}>
            <div className={styles.userDropdown} onClick={toggleDropdown}>
              <i className={`fas fa-user-circle ${styles.userIcon}`}></i>
              <span>Welcome, {currentUser.displayName || currentUser.email.split('@')[0]}</span>
              <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
              
              {dropdownOpen && (
                <div className={`${styles.dropdownMenu} ${dropdownClosing ? styles.closing : ''}`}>
                  <Link to="/profile" className={styles.dropdownItem} onClick={closeDropdown}>
                    <i className="fas fa-user"></i> Profile
                  </Link>
                  <Link to="/order-history" className={styles.dropdownItem} onClick={closeDropdown}>
                    <i className="fas fa-history"></i> Order History
                  </Link>
                  <Link to="/wishlist" className={styles.dropdownItem} onClick={closeDropdown}>
                    <i className="fas fa-heart"></i> Wishlist
                  </Link>
                  <Link to="/settings" className={styles.dropdownItem} onClick={closeDropdown}>
                    <i className="fas fa-cog"></i> Settings
                  </Link>
                  <div className={styles.dropdownDivider}></div>
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/signup" className={styles.authLink}>Sign Up</Link>
            <Link to="/login" className={styles.authLink}>Login</Link>
          </div>
        )}
        
        <CartIcon />
      </div>
    </nav>
  );
};

export default NavBar;



// import React from 'react';
// import './Navigation.css';

// const NavBar = ({ categories }) => {
//   const { currentUser, loading, logout } = useAuth();
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <nav className="main-nav">
//         <div className="nav-loading">Loading...</div>
//       </nav>
//     );
//   }

//   return (
//     <nav className="main-nav">
//       <Link to="/" className="logo">SOLE<span>HUB</span></Link>
//       <div className="nav-links">
//         <Link to="/">Home</Link>
//         <Link to="/new-arrivals">New Arrivals</Link>
//         <Link to="/best-sellers">Best Sellers</Link>
//         <Link to="/deals">Deals</Link>
//         <Link to="/categories">Categories</Link>
        
//         {currentUser ? (
//           <div className="user-section">
//             <div className="user-dropdown" onClick={toggleDropdown}>
//               <i className="fas fa-user-circle user-icon"></i>
//               <span>Welcome, {currentUser.displayName || currentUser.email}</span>
//               <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
              
//               {dropdownOpen && (
//                 <div className="dropdown-menu">
//                   <Link to="/profile" className="dropdown-item">
//                     <i className="fas fa-user"></i> Profile
//                   </Link>
//                   <Link to="/order-history" className="dropdown-item">
//                     <i className="fas fa-history"></i> Order History
//                   </Link>
//                   <Link to="/settings" className="dropdown-item">
//                     <i className="fas fa-cog"></i> Settings
//                   </Link>
//                   <div className="dropdown-divider"></div>
//                   <button className="dropdown-item" onClick={handleLogout}>
//                     <i className="fas fa-sign-out-alt"></i> Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="auth-links">
//             <Link to="/signup">Sign Up</Link>
//             <Link to="/login">Login</Link>
//           </div>
//         )}
        
//         <CartIcon />
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
import { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useLocation
} from 'react-router-dom';
import Signup from './pages/signup';
import Login from './pages/login';
import { auth } from './firebase';
import HomePage from './home/home';
import NewArrivalsPage from './newArrival/newArrival';
import BestSellersPage from './BestSeller/BestSeller';
import DealsPage from './Deal/Deal';
import CategoriesPage from './category/category';
import CategoryProductsPage from './CategoryProducts/categoryP';
import ProductDetail from './ProductInfo/ProductInfo';
import Checkout from './checkout/checkout';
import Cart from './cart/cart';
import { CartProvider } from './cartcontext/cartcontext';
import { AuthProvider, useAuth } from './Authcontext';
import OrderConfirmation from './Order/orderconfirm';
import OrderDetails from './Order/orderDetail';
import OrderHistory from './Order/orderHistory';
import UserProfile from './profile/userprof';
import NavBar from './navigation/navigation';
import Review from './review/review'; 

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ 
      message: 'Please sign in to access this page',
      returnUrl: location.pathname 
    }} replace />;
  }

  return children;
};

function App() {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    // Fetch categories on app load
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <NavBar categories={categories} />
          
          <Routes>
            <Route path="/" element={<HomePage categories={categories} />} />
            <Route path="/new-arrivals" element={<NewArrivalsPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/best-sellers" element={<BestSellersPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/categories" element={<CategoriesPage categories={categories} />} />
            <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/order-confirmation" 
              element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-details/:orderId" 
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-history" 
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />

            // Add this route to your existing routes
<Route 
  path="/product/:id/reviews" 
  element={<Review />} 
/>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;







// // src/App.jsx

// import { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
// import Signup from './pages/signup';
// import Login from './pages/login';
// import { auth } from './firebase';
// import HomePage from './home/home';
// import NewArrivalsPage from './newArrival/newArrival';
// import BestSellersPage from './BestSeller/BestSeller';
// import DealsPage from './Deal/Deal';
// import CategoriesPage from './category/category';
// import CategoryProductsPage from './CategoryProducts/categoryP';
// import ProductDetail from './ProductInfo/ProductInfo';
// import Checkout from './checkout/checkout';
// import Cart from './cart/cart';
// import CartIcon from './carticon/carticon';
// import { CartProvider } from './cartcontext/cartcontext';
// import { AuthProvider, useAuth } from './Authcontext';
// import OrderConfirmation from './Order/orderconfirm';
// import OrderDetails from './Order/orderDetail';
// import OrderHistory from './Order/orderHistory';
// import UserProfile from './profile/userprof';

// import './App.css';

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { currentUser } = useAuth();
//   const location = useLocation();

//   if (!currentUser) {
//     return <Navigate to="/login" state={{ 
//       message: 'Please sign in to access this page',
//       returnUrl: location.pathname 
//     }} replace />;
//   }

//   return children;
// };

// function App() {
//   const [categories, setCategories] = useState([]);
  
//   useEffect(() => {
//     // Fetch categories on app load
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/categories');
//         const data = await response.json();
//         setCategories(data);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };
    
//     fetchCategories();
//   }, []);

//   return (
//     <AuthProvider>
//       <CartProvider>
//         <Router>
//           <NavBar categories={categories} />
          
//           <Routes>
//             <Route path="/" element={<HomePage categories={categories} />} />
//             <Route path="/new-arrivals" element={<NewArrivalsPage />} />
//             <Route path="/product/:id" element={<ProductDetail />} />
//             <Route 
//               path="/checkout" 
//               element={
//                 <ProtectedRoute>
//                   <Checkout />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/best-sellers" element={<BestSellersPage />} />
//             <Route path="/deals" element={<DealsPage />} />
//             <Route path="/categories" element={<CategoriesPage categories={categories} />} />
//             <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/login" element={<Login />} />
            
//             {/* New routes */}
//             <Route 
//               path="/order-confirmation" 
//               element={
//                 <ProtectedRoute>
//                   <OrderConfirmation />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/order-details/:orderId" 
//               element={
//                 <ProtectedRoute>
//                   <OrderDetails />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/order-history" 
//               element={
//                 <ProtectedRoute>
//                   <OrderHistory />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/profile" 
//               element={
//                 <ProtectedRoute>
//                   <UserProfile />
//                 </ProtectedRoute>
//               } 
//             />
//           </Routes>
//         </Router>
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// // Separate NavBar component to use useAuth hook
// const NavBar = ({ categories }) => {
//   const { currentUser, loading } = useAuth();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();
  
//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
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
//             <div 
//               className="user-dropdown" 
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//             >
//               <i className="fas fa-user-circle user-icon"></i>
//               <span>{currentUser.displayName || currentUser.email}</span>
//               <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
              
//               {dropdownOpen && (
//                 <div className="dropdown-menu">
//                   <Link 
//                     to="/profile" 
//                     className="dropdown-item"
//                     onClick={() => setDropdownOpen(false)}
//                   >
//                     <i className="fas fa-user"></i> Profile
//                   </Link>
//                   <Link 
//                     to="/order-history" 
//                     className="dropdown-item"
//                     onClick={() => setDropdownOpen(false)}
//                   >
//                     <i className="fas fa-history"></i> Order History
//                   </Link>
//                   <div className="dropdown-divider"></div>
//                   <button 
//                     className="dropdown-item" 
//                     onClick={handleLogout}
//                   >
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

// export default App;


  // // src/App.jsx  
  // import { useState, useEffect } from 'react';
  // import { 
  //   BrowserRouter as Router, 
  //   Routes, 
  //   Route, 
  //   Link, 
  //   Navigate, 
  //   useLocation,
  //   useNavigate  // Add this import
  // } from 'react-router-dom';
  // import Signup from './pages/signup';
  // import Login from './pages/login';
  // import { auth } from './firebase';
  // import HomePage from './home/home';
  // import NewArrivalsPage from './newArrival/newArrival';
  // import BestSellersPage from './BestSeller/BestSeller';
  // import DealsPage from './Deal/Deal';
  // import CategoriesPage from './category/category';
  // import CategoryProductsPage from './CategoryProducts/categoryP';
  // import ProductDetail from './ProductInfo/ProductInfo';
  // import Checkout from './checkout/checkout';
  // import Cart from './cart/cart';
  // import CartIcon from './carticon/carticon';
  // import { CartProvider } from './cartcontext/cartcontext';
  // import { AuthProvider, useAuth } from './Authcontext';
  // import OrderConfirmation from './Order/orderconfirm';
  // import OrderDetails from './Order/orderDetail';
  // import OrderHistory from './Order/orderHistory';
  // import UserProfile from './profile/userprof';
  // import NavBar from './navigation/navigation'; // Add this import at the top

  // import './App.css';

  // // Protected Route Component
  // const ProtectedRoute = ({ children }) => {
  //   const { currentUser } = useAuth();
  //   const location = useLocation();

  //   if (!currentUser) {
  //     return <Navigate to="/login" state={{ 
  //       message: 'Please sign in to access this page',
  //       returnUrl: location.pathname 
  //     }} replace />;
  //   }

  //   return children;
  // };

  // function App() {
  //   const [categories, setCategories] = useState([]);
    
  //   useEffect(() => {
  //     // Fetch categories on app load
  //     const fetchCategories = async () => {
  //       try {
  //         const response = await fetch('http://localhost:5000/api/categories');
  //         const data = await response.json();
  //         setCategories(data);
  //       } catch (error) {
  //         console.error('Error fetching categories:', error);
  //       }
  //     };
      
  //     fetchCategories();
  //   }, []);

  //   return (
  //     <AuthProvider>
  //       <CartProvider>
  //         <Router>
  //           <NavBar categories={categories} />
            
  //           <Routes>
  //             <Route path="/" element={<HomePage categories={categories} />} />
  //             <Route path="/new-arrivals" element={<NewArrivalsPage />} />
  //             <Route path="/product/:id" element={<ProductDetail />} />
  //             <Route 
  //               path="/checkout" 
  //               element={
  //                 <ProtectedRoute>
  //                   <Checkout />
  //                 </ProtectedRoute>
  //               } 
  //             />
  //             <Route path="/cart" element={<Cart />} />
  //             <Route path="/best-sellers" element={<BestSellersPage />} />
  //             <Route path="/deals" element={<DealsPage />} />
  //             <Route path="/categories" element={<CategoriesPage categories={categories} />} />
  //             <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
  //             <Route path="/signup" element={<Signup />} />
  //             <Route path="/login" element={<Login />} />
              
  //             {/* New routes */}
  //             <Route 
  //               path="/order-confirmation" 
  //               element={
  //                 <ProtectedRoute>
  //                   <OrderConfirmation />
  //                 </ProtectedRoute>
  //               } 
  //             />
  //             <Route 
  //               path="/order-details/:orderId" 
  //               element={
  //                 <ProtectedRoute>
  //                   <OrderDetails />
  //                 </ProtectedRoute>
  //               } 
  //             />
  //             <Route 
  //               path="/order-history" 
  //               element={
  //                 <ProtectedRoute>
  //                   <OrderHistory />
  //                 </ProtectedRoute>
  //               } 
  //             />
  //             <Route 
  //               path="/profile" 
  //               element={
  //                 <ProtectedRoute>
  //                   <UserProfile />
  //                 </ProtectedRoute>
  //               } 
  //             />
  //           </Routes>
  //         </Router>
  //       </CartProvider>
  //     </AuthProvider>
  //   );
  // }

  // // Separate NavBar component to use useAuth hook
  // const NavBar = ({ categories }) => {
  //   const { currentUser, loading } = useAuth();
  //   const [dropdownOpen, setDropdownOpen] = useState(false);
  //   const navigate = useNavigate();  // Now properly defined
    
  //   const handleLogout = async () => {
  //     try {
  //       await auth.signOut();
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
  //             <div 
  //               className="user-dropdown" 
  //               onClick={() => setDropdownOpen(!dropdownOpen)}
  //             >
  //               <i className="fas fa-user-circle user-icon"></i>
  //               <span>{currentUser.displayName || currentUser.email}</span>
  //               <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
                
  //               {dropdownOpen && (
  //                 <div className="dropdown-menu">
  //                   <Link 
  //                     to="/profile" 
  //                     className="dropdown-item"
  //                     onClick={() => setDropdownOpen(false)}
  //                   >
  //                     <i className="fas fa-user"></i> Profile
  //                   </Link>
  //                   <Link 
  //                     to="/order-history" 
  //                     className="dropdown-item"
  //                     onClick={() => setDropdownOpen(false)}
  //                   >
  //                     <i className="fas fa-history"></i> Order History
  //                   </Link>
  //                   <div className="dropdown-divider"></div>
  //                   <button 
  //                     className="dropdown-item" 
  //                     onClick={handleLogout}
  //                   >
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

  // export default App;
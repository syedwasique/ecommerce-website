// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../cartcontext/cartcontext'; // Updated import path
// import { useAuth } from '../Authcontext'; 
// import styles from './cart.module.css';

// const Cart = () => {
//   const navigate = useNavigate();
//   const { 
//     cart, // Changed from cartItems to cart
//     cartCount, 
//     updateQuantity, 
//     removeFromCart
//   } = useCart();
//     const { currentUser } = useAuth();

//   // Create safe reference to cart items
//   const cartItems = cart || [];
  
//   const calculateSubtotal = () => {
//     return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   };
  
//   const calculateDiscount = () => {
//     return cartItems.reduce((sum, item) => 
//       sum + ((item.originalPrice - item.price) * item.quantity), 0);
//   };
  
//   const calculateTotal = () => {
//     return calculateSubtotal();
//   };
  
//   const handleCheckout = () => {
//     if (!currentUser) {
//       navigate('/login', { 
//         state: { 
//           message: 'Please sign in to complete your purchase',
//           returnUrl: '/cart'
//         } 
//       });
//       return;
//     }
//     navigate('/checkout');
//   };

//   return (
//     <div className={styles.cartContainer}>
//       <div className={styles.cartHeader}>
//         <h1>Your Shopping Cart</h1>
//         <div className={styles.cartCount}>{cartCount} item{cartCount !== 1 ? 's' : ''}</div>
//       </div>
      
//       {cartItems.length === 0 ? (
//         <div className={styles.emptyCart}>
//           <div className={styles.emptyIcon}>🛒</div>
//           <h2>Your cart is empty</h2>
//           <p>Looks like you haven't added any shoes yet</p>
//           <button 
//             className={styles.browseBtn}
//             onClick={() => navigate('/')}
//           >
//             Browse Shoes
//           </button>
//         </div>
//       ) : (
//         <div className={styles.cartContent}>
//           <div className={styles.cartItems}>
//             {cartItems.map(item => (
//               <div key={`${item.id}-${item.color}`} className={styles.cartItem}>
//                 <div className={styles.itemImage}>
//                   {item.image ? (
//                     <img 
//                       src={item.image} 
//                       alt={item.name} 
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = 'https://via.placeholder.com/160x160?text=No+Image';
//                       }}
//                     />
//                   ) : (
//                     <div className={styles.shoePreview}></div>
//                   )}
//                 </div>
//                 <div className={styles.itemDetails}>
//                   <h3 className={styles.itemName}>{item.name}</h3>
//                   {item.color && (
//                     <p className={styles.itemColor}>Color: {item.color}</p>
//                   )}
                  
//                   <div className={styles.itemPrices}>
//                     <span className={styles.currentPrice}>Rs.{item.price.toLocaleString('en-PK')}</span>
//                     {item.originalPrice > item.price && (
//                       <span className={styles.originalPrice}>Rs.{item.originalPrice.toLocaleString('en-PK')}</span>
//                     )}
//                   </div>
                  
//                   <div className={styles.itemActions}>
//                     <div className={styles.quantitySelector}>
//                       <button 
//                         className={styles.quantityBtn} 
//                         onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)}
//                       >-</button>
//                       <span className={styles.quantity}>{item.quantity}</span>
//                       <button 
//                         className={styles.quantityBtn} 
//                         onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)}
//                       >+</button>
//                     </div>
//                     <button 
//                       className={styles.removeBtn}
//                       onClick={() => removeFromCart(item.id, item.color)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className={styles.cartSummary}>
//             <h2 className={styles.summaryTitle}>Order Summary</h2>
            
//             <div className={styles.summaryDetails}>
//               <div className={styles.summaryRow}>
//                 <span>Subtotal</span>
//                 <span>Rs.{calculateSubtotal().toLocaleString('en-PK')}</span>
//               </div>
//               <div className={styles.summaryRow}>
//                 <span>Discount</span>
//                 <span className={styles.discount}>-Rs.{calculateDiscount().toLocaleString('en-PK')}</span>
//               </div>
//               <div className={styles.summaryRow}>
//                 <span>Shipping</span>
//                 <span className={styles.freeShipping}>Free</span>
//               </div>
//               <div className={`${styles.summaryRow} ${styles.totalRow}`}>
//                 <span>Total</span>
//                 <span>Rs.{calculateTotal().toLocaleString('en-PK')}</span>
//               </div>
              
//               <p className={styles.taxNote}>Shipping & taxes calculated at checkout</p>
              
//               <button 
//                 className={styles.checkoutBtn}
//                 onClick={handleCheckout}
//               >
//                 CHECKOUT - Rs.{calculateTotal().toLocaleString('en-PK')} PKR
//               </button>
              
//               <div 
//                 className={styles.continueShopping}
//                 onClick={() => navigate('/')}
//               >
//                 <span className={styles.arrowIcon}>←</span> Continue shopping
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cartcontext/cartcontext';
import { useAuth } from '../Authcontext'; 
import styles from './cart.module.css';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cart,
    cartCount, 
    updateQuantity, 
    removeFromCart
  } = useCart();
  const { currentUser } = useAuth();

  // NEW: State for selected items
  const [selectedItems, setSelectedItems] = useState({});
  
  // Create safe reference to cart items
  const cartItems = cart || [];
  
  // NEW: Toggle item selection
  const toggleItemSelection = (itemId, color) => {
    const key = `${itemId}-${color}`;
    setSelectedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // NEW: Toggle all items selection
  const toggleAllItemsSelection = () => {
    const allSelected = cartItems.every(item => 
      selectedItems[`${item.id}-${item.color}`]
    );
    
    const newSelected = {};
    cartItems.forEach(item => {
      const key = `${item.id}-${item.color}`;
      newSelected[key] = !allSelected;
    });
    
    setSelectedItems(newSelected);
  };
  
  // NEW: Get selected cart items
  const getSelectedItems = () => {
    return cartItems.filter(item => 
      selectedItems[`${item.id}-${item.color}`]
    );
  };

  // NEW: Calculate based on selected items
  const calculateSubtotal = () => {
    const selected = getSelectedItems();
    return selected.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const calculateDiscount = () => {
    const selected = getSelectedItems();
    return selected.reduce((sum, item) => 
      sum + ((item.originalPrice - item.price) * item.quantity), 0);
  };
  
  const calculateTotal = () => {
    return calculateSubtotal();
  };
  
  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login', { 
        state: { 
          message: 'Please sign in to complete your purchase',
          returnUrl: '/cart'
        } 
      });
      return;
    }
    
    // NEW: Pass selected items to checkout
    const selected = getSelectedItems();
    navigate('/checkout', { state: { selectedItems: selected } });
  };

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <h1>Your Shopping Cart</h1>
        <div className={styles.cartCount}>{cartCount} item{cartCount !== 1 ? 's' : ''}</div>
      </div>
      
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any shoes yet</p>
          <button 
            className={styles.browseBtn}
            onClick={() => navigate('/')}
          >
            Browse Shoes
          </button>
        </div>
      ) : (
        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {/* NEW: Select All checkbox */}
            <div className={styles.selectAllContainer}>
              <input
                type="checkbox"
                id="selectAll"
                checked={cartItems.length > 0 && cartItems.every(item => 
                  selectedItems[`${item.id}-${item.color}`]
                )}
                onChange={toggleAllItemsSelection}
              />
              <label htmlFor="selectAll">Select all items</label>
            </div>
            
            {cartItems.map(item => {
              const itemKey = `${item.id}-${item.color}`;
              return (
                <div key={itemKey} className={styles.cartItem}>
                  {/* NEW: Item selection checkbox */}
                  <div className={styles.itemSelector}>
                    <input
                      type="checkbox"
                      checked={!!selectedItems[itemKey]}
                      onChange={() => toggleItemSelection(item.id, item.color)}
                      id={`select-${itemKey}`}
                    />
                  </div>
                  
                  <div className={styles.itemImage}>
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/160x160?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className={styles.shoePreview}></div>
                    )}
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    {item.color && (
                      <p className={styles.itemColor}>Color: {item.color}</p>
                    )}
                    
                    <div className={styles.itemPrices}>
                      <span className={styles.currentPrice}>Rs.{item.price.toLocaleString('en-PK')}</span>
                      {item.originalPrice > item.price && (
                        <span className={styles.originalPrice}>Rs.{item.originalPrice.toLocaleString('en-PK')}</span>
                      )}
                    </div>
                    
                    <div className={styles.itemActions}>
                      <div className={styles.quantitySelector}>
                        <button 
                          className={styles.quantityBtn} 
                          onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >-</button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button 
                          className={styles.quantityBtn} 
                          onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)}
                        >+</button>
                      </div>
                      <button 
                        className={styles.removeBtn}
                        onClick={() => removeFromCart(item.id, item.color)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className={styles.cartSummary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>Rs.{calculateSubtotal().toLocaleString('en-PK')}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Discount</span>
                <span className={styles.discount}>-Rs.{calculateDiscount().toLocaleString('en-PK')}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span className={styles.freeShipping}>Free</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>Rs.{calculateTotal().toLocaleString('en-PK')}</span>
              </div>
              
              <p className={styles.taxNote}>Shipping & taxes calculated at checkout</p>
              
              <button 
                className={styles.checkoutBtn}
                onClick={handleCheckout}
                disabled={getSelectedItems().length === 0}
              >
                CHECKOUT - Rs.{calculateTotal().toLocaleString('en-PK')} PKR
              </button>
              
              <div 
                className={styles.continueShopping}
                onClick={() => navigate('/')}
              >
                <span className={styles.arrowIcon}>←</span> Continue shopping
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
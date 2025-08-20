import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cartcontext/cartcontext';
import styles from './checkout.module.css';
import { useAuth } from '../Authcontext'; 

const Checkout = () => {
  const { cart, removeItemsByIds } = useCart();
  const cartItems = cart || [];
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // NEW: State for selected items
  const [selectedItems, setSelectedItems] = useState({});
  
  // Initialize all items as selected by default
  useEffect(() => {
    if (cartItems.length > 0) {
      const initialSelected = {};
      cartItems.forEach(item => {
        const key = `${item.id}-${item.color}`;
        initialSelected[key] = true;
      });
      setSelectedItems(initialSelected);
    }
  }, [cartItems]);

  useEffect(() => {
    if (!currentUser && cartItems.length > 0) {
      navigate('/login', { 
        state: { 
          message: 'Please sign in to complete your purchase',
          returnUrl: '/checkout'
        } 
      });
    }
  }, [currentUser, cartItems, navigate]);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    shippingMethod: 'free',
    paymentMethod: 'cod',
    saveInfo: false,
    sameBilling: true
  });

  // NEW: Toggle item selection
  const toggleItemSelection = (itemId, color) => {
    const key = `${itemId}-${color}`;
    setSelectedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // NEW: Get selected cart items
  const getSelectedItems = () => {
    return cartItems.filter(item => 
      selectedItems[`${item.id}-${item.color}`]
    );
  };

  // Calculate totals based on SELECTED items
  const selectedCartItems = getSelectedItems();
  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = formData.shippingMethod === 'express' ? 9.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Handle empty cart state
  if (cartItems.length === 0) {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.emptyCart}>
          <h2>Your cart is empty</h2>
          <p>You haven't added any items to your cart yet.</p>
          <Link to="/" className={styles.continueShoppingBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare order data with correct field names
      const orderData = {
        user_id: currentUser.uid,
        shipping_address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
        shipping_method: formData.shippingMethod,
        payment_method: formData.paymentMethod,
        subtotal: subtotal,
        shipping_cost: shipping,
        tax: tax,
        total: total
      };

      // Prepare items data with fallback for source
      const itemsData = selectedCartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        product_image: item.image, 
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        // Ensure source always has a value
        source: item.source || 'unknown'
      }));

      // Save order to database
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order: orderData,
          items: itemsData
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to place order');
      }

      // Remove ordered items from cart
      const itemIds = itemsData.map(item => `${item.product_id}-${item.color}`);
      removeItemsByIds(itemIds);

      // Redirect to confirmation page with order data
      navigate('/order-confirmation', {
        state: { 
          order: {
            ...orderData,
            id: result.orderId,
            order_date: new Date().toISOString(),
            items: itemsData,
            status: 'Processing'
          }
        }
      });
    } catch (err) {
      console.error('Order submission error:', err);
      alert(`Failed to place order: ${err.message}`);
    }
  };


  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutHeader}>
        <Link to="/" className={styles.backLink}>
          <i className="fas fa-arrow-left"></i> Continue Shopping
        </Link>
        <h1>Checkout</h1>
      </div>

      <div className={styles.checkoutContent}>
        <form className={styles.checkoutForm} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
                className={styles.formInput}
              />
              <div className={styles.formNote}>
                <input 
                  type="checkbox" 
                  id="emailUpdates" 
                  name="emailUpdates" 
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                <label htmlFor="emailUpdates" className={styles.checkboxLabel}>
                  Email me with news and offers
                </label>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Delivery Information</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Country/Region</label>
                <select 
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">Select Country</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Add complete address & nearest landmark"
                rows="3"
                required
                className={styles.formTextarea}
              ></textarea>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Postal Code (optional)</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className={styles.formInput}
              />
              <div className={styles.formNote}>
                <input 
                  type="checkbox" 
                  id="saveInfo" 
                  name="saveInfo" 
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                <label htmlFor="saveInfo" className={styles.checkboxLabel}>
                  Save this information for next time
                </label>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Shipping Method</h2>
            <div className={styles.shippingOptions}>
              <label className={styles.shippingOption}>
                <input
                  type="radio"
                  name="shippingMethod"
                  value="free"
                  checked={formData.shippingMethod === 'free'}
                  onChange={handleInputChange}
                  className={styles.radioInput}
                />
                <div className={styles.optionContent}>
                  <span className={styles.optionTitle}>Standard Delivery</span>
                  <span className={styles.optionValue}>FREE</span>
                  <span className={styles.optionDescription}>3-5 business days</span>
                </div>
              </label>
              
              <label className={styles.shippingOption}>
                <input
                  type="radio"
                  name="shippingMethod"
                  value="express"
                  checked={formData.shippingMethod === 'express'}
                  onChange={handleInputChange}
                  className={styles.radioInput}
                />
                <div className={styles.optionContent}>
                  <span className={styles.optionTitle}>Express Delivery</span>
                  <span className={styles.optionValue}>$9.99</span>
                  <span className={styles.optionDescription}>1-2 business days</span>
                </div>
              </label>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Payment Method</h2>
            <div className={styles.paymentOptions}>
              <label className={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                  className={styles.radioInput}
                />
                <div className={styles.optionContent}>
                  <i className="fas fa-money-bill-wave"></i>
                  <div>
                    <span className={styles.optionTitle}>Cash on Delivery (COD)</span>
                    <span className={styles.optionDescription}>Pay when you receive</span>
                  </div>
                </div>
              </label>
              
              <label className={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                  className={styles.radioInput}
                />
                <div className={styles.optionContent}>
                  <i className="fas fa-credit-card"></i>
                  <div>
                    <span className={styles.optionTitle}>Credit/Debit Card</span>
                    <span className={styles.optionDescription}>Secure online payment</span>
                  </div>
                </div>
              </label>
              
              <label className={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={handleInputChange}
                  className={styles.radioInput}
                />
                <div className={styles.optionContent}>
                  <i className="fab fa-paypal"></i>
                  <div>
                    <span className={styles.optionTitle}>PayPal</span>
                    <span className={styles.optionDescription}>Fast and secure</span>
                  </div>
                </div>
              </label>
            </div>
            
            <div className={styles.billingAddress}>
              <div className={styles.formNote}>
                <input 
                  type="checkbox" 
                  id="sameBilling" 
                  name="sameBilling" 
                  checked={formData.sameBilling}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                <label htmlFor="sameBilling" className={styles.checkboxLabel}>
                  Same as shipping address
                </label>
              </div>
            </div>
            
            <div className={styles.securityNote}>
              <i className="fas fa-lock"></i>
              <span>All transactions are secure and encrypted</span>
            </div>
          </div>

          <button type="submit" className={styles.completeOrderBtn}>
            Complete Order
          </button>
        </form>
<div className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          
          <div className={styles.orderItems}>
            {cartItems.map(item => {
              const itemKey = `${item.id}-${item.color}`;
              return (
                <div 
                  className={styles.orderItem} 
                  key={itemKey}
                >
                  {/* NEW: Add checkbox for item selection */}
                  <div className={styles.itemSelector}>
                    <input
                      type="checkbox"
                      checked={!!selectedItems[itemKey]}
                      onChange={() => toggleItemSelection(item.id, item.color)}
                      id={`select-${itemKey}`}
                    />
                  </div>
                  
                  <div className={styles.summaryItemImage}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100x100?text=No+Img';
                      }}
                    />
                    <span className={styles.summaryQuantity}>{item.quantity}</span>
                  </div>
                  <div className={styles.summaryItemDetails}>
                    <h3 className={styles.summaryItemName}>{item.name}</h3>
                    <div className={styles.summaryItemMeta}>
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  <div className={styles.summaryItemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className={styles.promoCode}>
            <input 
              type="text" 
              placeholder="Discount code" 
              className={styles.promoInput}
            />
            <button className={styles.applyBtn}>Apply</button>
          </div>
          
          <div className={styles.orderTotals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className={styles.securePayment}>
            <i className="fas fa-lock"></i>
            <span>Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
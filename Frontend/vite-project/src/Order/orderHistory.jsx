import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Authcontext';
import styles from './history.module.css';

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setError('Please log in to view orders');
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `api/api/orders/user/${currentUser.uid}`
        );
        
        // Handle HTML responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(text || 'Invalid server response');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch orders');
        }
        
        // Convert numeric fields to numbers
        const processedOrders = data.map(order => ({
          ...order,
          total: Number(order.total),
          subtotal: Number(order.subtotal),
          shipping_cost: Number(order.shipping_cost),
          tax: Number(order.tax),
          items: order.items.map(item => ({
            ...item,
            price: Number(item.price)
          }))
        }));
        
        setOrders(processedOrders);
      } catch (err) {
        setError(err.message || 'Failed to load order history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    
    // Check if it's already a placeholder
    if (!e.target.src.includes('placeholder.com')) {
      // Try local fallback first
      e.target.src = '/images/no-image.png';
      
      // If local fallback fails, use placeholder
      e.target.onerror = () => {
        e.target.onerror = null;
        e.target.src = 'https://via.placeholder.com/100x100?text=No+Img';
      };
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1>Order History</h1>
      
      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't placed any orders yet.</p>
          <button 
            className={styles.btnPrimary}
            onClick={() => navigate('/')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <h3>Order #{order.id}</h3>
                  <p>{new Date(order.order_date).toLocaleDateString()}</p>
                </div>
                <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                  {order.status}
                </span>
              </div>
              
              <div className={styles.orderSummary}>
                <div className={styles.orderItemsPreview}>
                  {order.items.slice(0, 3).map((item, index) => {
                    const imageSrc = item.product_image || '/images/no-image.png';
                    
                    return (
                      <img 
                        key={index} 
                        src={imageSrc} 
                        alt={item.product_name} 
                        className={styles.itemImage}
                        onError={handleImageError}
                      />
                    );
                  })}
                  {order.items.length > 3 && (
                    <div className={styles.moreItems}>+{order.items.length - 3} more</div>
                  )}
                </div>
                
                <div className={styles.orderTotals}>
                  <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                  <p><strong>Items:</strong> {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                </div>
              </div>
              
              <div className={styles.orderActions}>
                <button 
                  className={styles.btnPrimary}
                  onClick={() => navigate(`/order-details/${order.id}`)}
                >
                  View Details
                </button>
                {order.status === 'Processing' && (
                  <button 
                    className={styles.btnDanger}
                    onClick={() => navigate(`/order-details/${order.id}`)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
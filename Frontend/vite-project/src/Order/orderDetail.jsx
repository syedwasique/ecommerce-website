import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authcontext';
import styles from './detail.module.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setError('Please log in to view orders');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/order/${orderId}?userId=${currentUser.uid}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch order');
        }
        
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, currentUser]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/${orderId}`, 
          { method: 'DELETE' }
        );
        
        if (!response.ok) {
          throw new Error('Failed to delete order');
        }
        
        navigate('/order-history', { 
          state: { message: 'Order cancelled successfully' } 
        });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle broken images
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
  };

  // Safe number formatting
  const formatCurrency = (value) => {
    return value ? `$${Number(value).toFixed(2)}` : '$0.00';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!order) return <div className={styles.error}>Order data not available</div>;

  return (
    <div className={styles.container}>
      <div className={styles.orderHeader}>
        <h1>Order Details</h1>
        <p>Order ID: #{order.id}</p>
      </div>
      
      <div className={styles.orderInfo}>
        <div className={styles.infoSection}>
          <h2>Order Summary</h2>
          <p><strong>Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> {formatCurrency(order.total)}</p>
        </div>
        
        <div className={styles.infoSection}>
          <h2>Shipping Information</h2>
          <p>{order.shipping_address || 'N/A'}</p>
          <p>{order.city || ''}, {order.postal_code || ''}, {order.country || ''}</p>
          <p>Phone: {order.phone || 'N/A'}</p>
          <p><strong>Shipping Method:</strong> {order.shipping_method || 'Standard'}</p>
        </div>
        
        <div className={styles.infoSection}>
          <h2>Payment Information</h2>
          <p><strong>Method:</strong> {order.payment_method || 'N/A'}</p>
        </div>
      </div>
      
      <div className={styles.itemsSection}>
        <h2>Items Ordered</h2>
        {order.items?.length > 0 ? (
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className={styles.productInfo}>
                      <img 
                        src={item.product_image} 
                        alt={item.product_name} 
                        className={styles.productImage}
                        onError={handleImageError}
                      />
                      <span>{item.product_name || 'Unknown Product'}</span>
                    </div>
                  </td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{item.quantity || 1}</td>
                  <td>{formatCurrency((item.price || 0) * (item.quantity || 1))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items found in this order</p>
        )}
      </div>
      
      <div className={styles.totalsSection}>
        <div className={styles.totalsRow}>
          <span>Subtotal:</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        <div className={styles.totalsRow}>
          <span>Shipping:</span>
          <span>{formatCurrency(order.shipping_cost)}</span>
        </div>
        <div className={styles.totalsRow}>
          <span>Tax:</span>
          <span>{formatCurrency(order.tax)}</span>
        </div>
        <div className={`${styles.totalsRow} ${styles.grandTotal}`}>
          <span>Total:</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>
      
      <div className={styles.actions}>
        <button 
          className={styles.btnPrimary}
          onClick={() => window.print()}
        >
          Print Receipt
        </button>
        {order.status === 'Processing' && (
          <button 
            className={styles.btnDanger}
            onClick={handleDelete}
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
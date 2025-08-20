// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../Authcontext';
// import styles from './confirm.module.css';

// const OrderConfirmation = () => {
//   const { currentUser } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (location.state?.order) {
//       setOrder(location.state.order);
//       setLoading(false);
//     } else {
//       navigate('/');
//     }
//   }, [location, navigate]);

//   const printReceipt = () => {
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Order Receipt</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             .header { text-align: center; margin-bottom: 20px; }
//             .store-name { font-size: 24px; font-weight: bold; }
//             .order-info { margin-bottom: 20px; }
//             table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
//             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//             th { background-color: #f2f2f2; }
//             .total { text-align: right; font-weight: bold; }
//             .thank-you { text-align: center; margin-top: 30px; font-style: italic; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <div class="store-name">SOLEHUB</div>
//             <div>Order Receipt</div>
//           </div>
          
//           <div class="order-info">
//             <div><strong>Order ID:</strong> ${order.id}</div>
//             <div><strong>Date:</strong> ${new Date(order.order_date).toLocaleString()}</div>
//             <div><strong>Customer:</strong> ${currentUser.displayName || currentUser.email}</div>
//           </div>
          
//           <table>
//             <thead>
//               <tr>
//                 <th>Product</th>
//                 <th>Price</th>
//                 <th>Quantity</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${order.items.map(item => `
//                 <tr>
//                   <td>${item.product_name}</td>
//                   <td>$${item.price.toFixed(2)}</td>
//                   <td>${item.quantity}</td>
//                   <td>$${(item.price * item.quantity).toFixed(2)}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
          
//           <div class="total">
//             <div>Subtotal: $${order.subtotal.toFixed(2)}</div>
//             <div>Shipping: $${order.shipping_cost.toFixed(2)}</div>
//             <div>Tax: $${order.tax.toFixed(2)}</div>
//             <div>Total: $${order.total.toFixed(2)}</div>
//           </div>
          
//           <div class="thank-you">
//             Thank you for your purchase!
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className={styles.container}>
//       <div className={styles.confirmationCard}>
//         <div className={styles.header}>
//           <h1>Order Confirmed!</h1>
//           <p>Thank you for your purchase, {currentUser.displayName || currentUser.email}</p>
//         </div>
        
//         <div className={styles.orderSummary}>
//           <h2>Order #{order.id}</h2>
//           <p><strong>Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
//           <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
//           <p><strong>Status:</strong> {order.status}</p>
          
//           <div className={styles.actions}>
//             <button 
//               className={styles.btnPrimary}
//               onClick={() => navigate(`/order-details/${order.id}`)}
//             >
//               View Order Details
//             </button>
//             <button 
//               className={styles.btnSecondary}
//               onClick={printReceipt}
//             >
//               Print Receipt
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmation;

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authcontext';
import { useCart } from '../cartcontext/cartcontext';
import styles from './confirm.module.css';

const OrderConfirmation = () => {
  const { currentUser } = useAuth();
  const { removeItemsByIds } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Use ref to track if items have been removed
  const itemsRemoved = useRef(false);

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
      setLoading(false);
      
      // Only remove items once
      if (!itemsRemoved.current) {
        const itemIds = location.state.order.items.map(item => 
          `${item.id}-${item.color}`
        );
        removeItemsByIds(itemIds);
        itemsRemoved.current = true;
      }
    } else {
      navigate('/', { replace: true });
    }
  }, [location, navigate, removeItemsByIds]);

  const printReceipt = () => {
    if (!order) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .store-name { font-size: 24px; font-weight: bold; }
            .order-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { text-align: right; font-weight: bold; }
            .thank-you { text-align: center; margin-top: 30px; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="store-name">SOLEHUB</div>
            <div>Order Receipt</div>
          </div>
          
          <div class="order-info">
            <div><strong>Order ID:</strong> ${order.id}</div>
            <div><strong>Date:</strong> ${new Date(order.order_date).toLocaleString()}</div>
            <div><strong>Customer:</strong> ${currentUser.displayName || currentUser.email}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Color</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.color || 'N/A'}</td>
                  <td>Rs.${item.price.toLocaleString('en-PK')}</td>
                  <td>${item.quantity}</td>
                  <td>Rs.${(item.price * item.quantity).toLocaleString('en-PK')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            <div>Subtotal: Rs.${order.subtotal.toLocaleString('en-PK')}</div>
            <div>Shipping: Rs.${order.shipping_cost?.toLocaleString('en-PK') || '0'}</div>
            <div>Tax: Rs.${order.tax?.toLocaleString('en-PK') || '0'}</div>
            <div>Total: Rs.${order.total.toLocaleString('en-PK')}</div>
          </div>
          
          <div class="thank-you">
            Thank you for your purchase!
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleViewOrderDetails = () => {
    navigate(`/order-details/${order.id}`, { 
      state: { order },
      replace: true
    });
  };

  if (loading) return <div className={styles.loadingContainer}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.confirmationCard}>
        <div className={styles.header}>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase, {currentUser.displayName || currentUser.email}</p>
        </div>
        
        <div className={styles.orderSummary}>
          <h2>Order #{order.id}</h2>
          <p><strong>Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
          <p><strong>Total:</strong> Rs.{order.total.toLocaleString('en-PK')}</p>
          <p><strong>Status:</strong> {order.status}</p>
          
          <div className={styles.actions}>
            <button 
              className={styles.btnPrimary}
              onClick={handleViewOrderDetails}
            >
              View Order Details
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
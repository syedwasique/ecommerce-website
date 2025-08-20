


import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, [cart]);

  // Add this function to update auth status
  const updateAuthStatus = (status) => {
    setIsAuthenticated(status);
  };

  const addToCart = (product) => {
    setCart(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === product.id && item.color === product.color
      );
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id && item.color === product.color
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: product.image_url || '',
          color: product.color || '',
          quantity: product.quantity || 1
        }
      ];
    });
  };

  const updateQuantity = (id, color, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevItems =>
      prevItems.map(item => 
        item.id === id && item.color === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (id, color) => {
    setCart(prevItems =>
      prevItems.filter(item => !(item.id === id && item.color === color))
    );
  };

  // NEW: Function to remove multiple items by IDs
  const removeItemsByIds = (itemIds) => {
    setCart(prevItems => 
      prevItems.filter(item => !itemIds.includes(`${item.id}-${item.color}`))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart,
        cartCount, 
        addToCart, 
        updateQuantity, 
        removeFromCart,
        removeItemsByIds, // NEW: Add this function
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};




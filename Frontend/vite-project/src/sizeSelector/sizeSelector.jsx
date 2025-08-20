import React, { useState, useEffect } from 'react';
import styles from './sizeSelector.module.css';

const SizeSelector = ({ basePrice, onSizeChange, availableSizes }) => {
  const sizePriceAdjustments = {
    '5': -0.1,   // 10% discount for small sizes
    '6': -0.05,
    '7': 0,      // base price
    '8': 0.05,   // 5% premium
    '9': 0.1,    // 10% premium
    '10': 0.15,
    '11': 0.2,
    '12': 0.25,
    '13': 0.3,
  };

  const [selectedSize, setSelectedSize] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(basePrice);

  useEffect(() => {
    if (selectedSize) {
      const adjustment = sizePriceAdjustments[selectedSize] || 0;
      const newPrice = basePrice * (1 + adjustment);
      setCurrentPrice(newPrice);
      onSizeChange(selectedSize, newPrice);
    } else {
      setCurrentPrice(basePrice);
      onSizeChange(null, basePrice);
    }
  }, [selectedSize, basePrice, onSizeChange]);

  const handleSizeSelect = (size) => {
    setSelectedSize(selectedSize === size ? null : size);
  };

  const getOptionClasses = (size) => {
    let classes = styles.option;
    if (selectedSize === size) classes += ` ${styles.selected}`;
    if (!availableSizes.includes(size)) classes += ` ${styles.outOfStock}`;
    return classes;
  };

  return (
    <div className={styles.container}>
      <div className={styles.options}>
        {availableSizes.map(size => (
          <button
            key={size}
            className={getOptionClasses(size)}
            onClick={() => handleSizeSelect(size)}
            disabled={!availableSizes.includes(size)}
          >
            {size}
          </button>
        ))}
      </div>
      <div className={styles.priceDisplay}>
        {selectedSize ? (
          <>
            <span className={styles.finalPrice}>${currentPrice.toFixed(2)}</span>
            {sizePriceAdjustments[selectedSize] > 0 && (
              <span className={styles.originalPrice}>${basePrice.toFixed(2)}</span>
            )}
          </>
        ) : (
          <span className={styles.basePrice}>${basePrice.toFixed(2)}</span>
        )}
      </div>
    </div>
  );
};

export default SizeSelector;
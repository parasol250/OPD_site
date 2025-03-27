import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Цена: {product.price} руб.</p>
      <p>Магазин: {product.store}</p>
      <a href={product.link} target="_blank" rel="noopener noreferrer">Перейти в магазин</a>
    </div>
  );
};

export default ProductCard;

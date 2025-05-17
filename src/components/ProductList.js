//import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList({ products, currentUser, favorites, toggleFavorite }) {

  if (!products || products.length === 0) {
      return <p>Нет товаров для отображения.</p>;
  }

  return (
    <div className="product-list">
      {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            currentUser={currentUser}
            isFavorite={favorites && favorites.includes(product.id)}
            toggleFavorite={toggleFavorite}
          />
      ))}
    </div>
  );
}

export default ProductList;
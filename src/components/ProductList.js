import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList({ products }) {
  console.log("Products in ProductList:", products);

  if (!products || products.length === 0) {
      return <p>Нет товаров для отображения.</p>;
  }

  return (
    <div className="product-list">
      {products.map(product => (
          <ProductCard key={product.id} product={product} /> // Используем ProductCard
      ))}
    </div>
  );
}

export default ProductList;

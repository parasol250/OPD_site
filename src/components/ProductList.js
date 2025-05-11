import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList({ products, currentUser, favorites, toggleFavorite }) {
  console.log("Products in ProductList:", products);
  console.log("Products with images:", products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image_paths: p.image_paths,
    images: p.images,
    hasLocalImages: p.image_paths && p.image_paths.length > 0,
    hasRemoteImages: p.images && p.images.length > 0
  })));

  if (!products || products.length === 0) {
      return <p>Нет товаров для отображения.</p>;
  }

  return (
    <div className="product-list">
      {console.log("Raw products data:", products.map(p => ({ 
        id: p.id, 
        original_url: p.original_url 
      })))}
      {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            currentUser={currentUser}
            isFavorite={favorites && favorites.includes(product.id)}
            toggleFavorite={toggleFavorite}
          /> // Используем ProductCard
      ))}
    </div>
  );
}

export default ProductList;
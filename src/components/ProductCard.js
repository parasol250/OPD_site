import React, { useState } from 'react';
import defaultImage from './default-product-image.jpg'; // Запасное изображение

const ProductCard = ({ product, currentUser, isFavorite, toggleFavorite }) => {

  // Проверяем наличие product и его свойств
  if (!product) {
    return <div className="product-card error">Ошибка: данные товара не загружены</div>;
  }
  // Construct image path
  const getImageSource = () => {
    if (product.image_paths) {
      const pathsArray = Array.isArray(product.image_paths) 
        ? product.image_paths 
        : String(product.image_paths).split(',').map(path => path.trim());
      
      if (pathsArray.length > 0) {
        const firstPath = pathsArray[0];
        const cleanPath = firstPath.startsWith('full/') 
          ? firstPath.substring(5) 
          : firstPath;
        return `/images/full/${cleanPath}`;
      }
    }
    
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    
    return defaultImage;
  };

  // Format price
  const formattedPrice = product.price ? 
  `${product.price.toLocaleString('ru-RU')} руб.` : 
  'Цена не указана';

  const handleShopClick = (url) => {
    // Проверяем что url существует и является строкой
    if (!url || typeof url !== 'string') {
      console.error('Invalid URL:', url);
      return;
    }

    try {
      // Ensure URL is properly encoded
      const encodedUrl = encodeURI(url.trim());
      // Verify URL structure
      const validatedUrl = new URL(encodedUrl);
      window.open(validatedUrl.href, '_blank', 'noopener noreferrer');
    } catch (e) {
      console.error('Invalid URL format:', url, e);
      // Optional: Show user feedback
      alert('Невозможно открыть ссылку на магазин');
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
          <img
              src={getImageSource()} 
              alt={product.name || 'Изображение товара'}
              className="product-image"
              onError={(e) => {
                console.error('Image load error:', {
                  attemptedUrl: e.target.src,
                  productId: product.id,
                  error: e.nativeEvent
                });
                  e.target.src = defaultImage;
              }}
          />
          {currentUser?.role === 'user' && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
              className={`favorite-button ${isFavorite ? 'active' : ''}`}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        {product.description && <p className="description">{product.description}</p>}
        <p className="price">{formattedPrice}</p>
        {product.shop_name && <p className="store">Магазин: {product.shop_name}</p>}
        {product.original_url ? (
          <button 
            onClick={() => handleShopClick(product.original_url)}
            className="shop-button"
          >
            Перейти в магазин
          </button>
        ) : (
          <button className="shop-button disabled" disabled>
            Ссылка недоступна
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
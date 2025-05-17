//import React from 'react';
import './FavouritesModal.css';
import defaultImage from './default-product-image.jpg';

const FavoritesModal = ({ 
  show, 
  onClose, 
  favorites, 
  products, 
  toggleFavorite 
}) => {
  if (!show) return null;

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const getImageSource = (product) => {
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Избранные товары</h2>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="favorites-list">
          {favoriteProducts.length > 0 ? (
            favoriteProducts.map(product => (
              <div key={product.id} className="favorite-item">
                <div className="favorite-image-container">
                  <img 
                    src={getImageSource(product)} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                  <button 
                    className="remove-favorite"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    Удалить
                  </button>
                </div>
                <div className="favorite-info">
                  <h3>{product.name}</h3>
                  <p>{product.price ? `${product.price.toLocaleString('ru-RU')} руб.` : 'Цена не указана'}</p>
                  {product.shop_name && <p>Магазин: {product.shop_name}</p>}
                  {product.original_url && (
                    <a 
                      href={product.original_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="shop-link"
                    >
                      Перейти в магазин
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Нет избранных товаров</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;
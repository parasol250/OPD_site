import React from 'react';
import './FavouritesModal.css';

const FavoritesModal = ({ show, onClose, favorites, products }) => {
  if (!show) return null;

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Избранные товары</h2>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="favorites-list">
          {favoriteProducts.length > 0 ? (
            favoriteProducts.map(product => (
              <div key={product.id} className="favorite-item">
                <img src={product.image_paths?.split(',')[0] || ''} alt={product.name} />
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.price} руб.</p>
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
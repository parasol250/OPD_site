//import React from 'react';
import './Header.css';
import FilterSidebar from './FilterSidebar';
import { Link } from 'react-router-dom';

function Header({ onOpenPopup, onSearch, onFilterChange, onCategorySelect, isLoggedIn, userRole, onShowFavorites, onOpenAdminPanel, filters }) {
  const handleInputChange = (event) => {
    onSearch(event.target.value);
  };
  
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="home-button">Главная</Link>
        <input
          type="text"
          placeholder="Поиск по названию"
          onChange={handleInputChange}
        />
        {isLoggedIn && userRole === 'user' && (
          <button 
            className="favorites-button"
            onClick={onShowFavorites}
          >
            ♥
          </button>
        )}
        {isLoggedIn && userRole === 'admin' && (
          <button 
            className="admin-button"
            onClick={onOpenAdminPanel}
          >
            Админпанель
          </button>
        )}
        {isLoggedIn ? (
          <div className="user-actions">
            <button className="logout-button" onClick={onOpenPopup}>Сменить аккаунт</button>
          </div>
        ) : (
          <button className="login-button" onClick={onOpenPopup}>Войти</button>
        )}
      </div>
      <div className="furniture-categories">
        <Link to="/category/Диваны и кресла">Диваны и кресла</Link>
        <Link to="/category/Шкафы и стеллажи">Шкафы и стеллажи</Link>
        <Link to="/category/Кровати и матрасы">Кровати и матрасы</Link>
        <Link to="/category/Тумбы и комоды">Тумбы и комоды</Link>
        <Link to="/category/Столы и стулья">Столы и стулья</Link>
        <Link to="/category/Детская мебель">Детская мебель</Link>
      </div>
      <FilterSidebar 
        onFilterChange={onFilterChange}
        initialFilters={filters}
        onCategorySelect={onCategorySelect}
      />
    </header>
  );
}

export default Header;
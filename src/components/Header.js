// Header.js
import React from 'react';
import './Header.css'; // Импортируем стили
import FilterSidebar from './FilterSidebar';
import { Link } from 'react-router-dom';

function Header({ onOpenPopup, onSearch, isLoggedIn }) { // Принимаем onOpenPopup и onSearch
  const handleInputChange = (event) => {
    onSearch(event.target.value); // Вызываем onSearch при изменении значения
  };
  
  return (
    <header className="header">
      <div className="header-content">
      <Link to="/" className="home-button">Главная</Link> {/* Home button */}
        <input
          type="text"
          placeholder="Поиск по названию"
          onChange={handleInputChange} // Вызываем onSearch при изменении
        />
        <button className="login-button" onClick={onOpenPopup}>Войти</button>
      </div>
      <div className="furniture-categories">
        <Link to="/category/Диваны и кресла">Диваны и кресла</Link>
        <Link to="/category/Шкафы и стеллажи">Шкафы и стеллажи</Link>
        <Link to="/category/Кровати и матрасы">Кровати и матрасы</Link>
        <Link to="/category/Тумбы и комоды">Тумбы и комоды</Link>
        <Link to="/category/Столы и стулья">Столы и стулья</Link>
        <Link to="/category/Детская мебель">Детская мебель</Link>
      </div>
      <FilterSidebar onFilterChange={() => {}} />
    </header>
  );
}

export default Header;
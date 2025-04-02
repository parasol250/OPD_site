// Header.js
import React from 'react';
import './Header.css'; // Импортируем стили
import FilterSidebar from './FilterSidebar';
import { Link } from 'react-router-dom';

function Header({ onOpenPopup, onSearch, isLoggedIn }) { // Принимаем onOpenPopup и onSearch
  const handleInputChange = (event) => {
    onSearch(event.target.value); // Вызываем onSearch при изменении значения
  };

  const handleCategoryClick = (category) => {
    console.log(`Category clicked: ${category}`);
    // Add your logic here to filter products based on the selected category
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
          <button onClick={() => handleCategoryClick('Диваны и кресла')}>Диваны и кресла</button>
          <button onClick={() => handleCategoryClick('Шкафы и стеллажи')}>Шкафы и стеллажи</button>
          <button onClick={() => handleCategoryClick('Кровати и матрасы')}>Кровати и матрасы</button>
          <button onClick={() => handleCategoryClick('Комоды и тумбы')}>Комоды и тумбы</button>
          <button onClick={() => handleCategoryClick('Столы и стулья')}>Столы и стулья</button>
          <button onClick={() => handleCategoryClick('Детская мебель')}>Детская мебель</button>
        </div>
      <FilterSidebar onFilterChange={() => {}} />
    </header>
  );
}

export default Header;
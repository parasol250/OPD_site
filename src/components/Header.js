// Header.js
import React from 'react';
import './Header.css'; // Импортируем стили

function Header({ onOpenPopup, onSearch }) { // Принимаем onOpenPopup и onSearch
  const handleInputChange = (event) => {
    onSearch(event.target.value); // Вызываем onSearch при изменении значения
  };

  return (
    <header className="header">
      <div className="header-content">
        <input
          type="text"
          placeholder="Поиск по названию"
          onChange={handleInputChange} // Вызываем onSearch при изменении
        />
        <button className="login-button" onClick={onOpenPopup}>Войти</button>
      </div>
    </header>
  );
}

export default Header;
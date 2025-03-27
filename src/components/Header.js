import React, { useState } from 'react';

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value); // Передаем поисковый запрос в App.js
  };

  return (
    <header className="header">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
    </header>
  );
};

export default Header;

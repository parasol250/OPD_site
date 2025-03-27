import React, { useState } from 'react';

const FilterSidebar = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [material, setMaterial] = useState('');

  const handlePriceChange = (event) => {
    setPriceRange([event.target.value]);
  };

  const handleMaterialChange = (event) => {
    setMaterial(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onFilterChange({
      price: priceRange,
      material: material,
    });
  };

  return (
    <aside className="filter-sidebar">
      <h2>Фильтры</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="price">Цена:</label>
          <input
            type="range"
            id="price"
            min="0"
            max="100000"
            value={priceRange}
            onChange={handlePriceChange}
          />
          <span>{priceRange}</span>
        </div>
        <div>
          <label htmlFor="material">Материал:</label>
          <select id="material" value={material} onChange={handleMaterialChange}>
            <option value="">Любой</option>
            <option value="дерево">Дерево</option>
            <option value="металл">Металл</option>
            <option value="пластик">Пластик</option>
          </select>
        </div>
        <button type="submit">Применить</button>
      </form>
    </aside>
  );
};

export default FilterSidebar;

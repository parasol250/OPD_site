import React, { useState, useEffect } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState(100000);
  const maxPrice = 100000; // Maximum price value
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [availability, setAvailability] = useState('');
  const [brand, setBrand] = useState('');
  const [market, setMarket] = useState('');

  useEffect(() => {
    // При монтировании компонента устанавливаем максимальное значение
    setPriceRange(100000);
  }, []);
  
  const handlePriceChange = (event) => {
    setPriceRange(parseInt(event.target.value, 10));
  };

  const handleMaterialChange = (event) => {
    setMaterial(event.target.value);
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };
  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };
  const handleAvailabilityChange = (event) => {
    setAvailability(event.target.value);
  };
  const handleBrandChange = (event) => {
    setBrand(event.target.value);
  };
  const handleMarketChange = (event) => {
    setMarket(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onFilterChange({
      price: priceRange,
      material: material,
      color: color,
      size: size,
      availability: availability,
      brand: brand,
      market: market,
    });
  };

  return (
    <div className="filter-sidebar">
      <h2>Фильтры</h2>
      <form onSubmit={handleSubmit}>
        <div classname="price-range-container">
          <label htmlFor="price">Цена</label>
          <input
            type="range"
            id="price"
            min="0"
            max={maxPrice}
            value={priceRange}
            onChange={handlePriceChange}
            className="price-input"
          />
          <span className="price-value"> до {priceRange.toLocaleString()} ₽</span>
        </div>
        <div>
          <label htmlFor="material">Материал</label>
          <select id="material" value={material} onChange={handleMaterialChange}>
            <option value="">Любой</option>
            <option value="дерево">Дерево</option>
            <option value="металл">Металл</option>
            <option value="пластик">Пластик</option>
          </select>
        </div>
        <div>
        <label htmlFor="color">Цвет</label>
          <select id="color" value={color} onChange={handleColorChange}>
            <option value="">Любой</option>
            <option value="красный">Красный</option>
            <option value="зеленый">Зеленый</option>
            <option value="черный">Черный</option>
          </select>
        </div>
        <div>
        <label htmlFor="size">Размер</label>
          <select id="size" value={size} onChange={handleSizeChange}>
            <option value="">Любой</option>
            <option value="маленький">Мини</option>
            <option value="средний">Норм</option>
            <option value="большой">Биги</option>
          </select>
        </div>
        <div>
        <label htmlFor="availability">Наличие</label>
          <select id="availability" value={availability} onChange={handleAvailabilityChange}>
            <option value="">Все</option>
            <option value="есть">В наличии</option>
            <option value="нет">Нет в наличии</option>
          </select>
        </div>
        <div>
        <label htmlFor="brand">Бренд</label>
          <select id="brand" value={brand} onChange={handleBrandChange}>
            <option value="">Любой</option>
            <option value="gucci">gucci</option>
            <option value="prada">prada</option>
          </select>
        </div>
        <div>
        <label htmlFor="market">Магазин</label>
          <select id="market" value={market} onChange={handleMarketChange}>
            <option value="">Любой</option>
            <option value="ozon">OZON</option>
            <option value="wb">Wildberries</option>
            <option value="yandex">Яндекс.Маркет</option>
          </select>
        </div>
        <button type="submit">Применить</button>
      </form>
    </div>
  );
};

export default FilterSidebar;
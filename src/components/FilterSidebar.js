//import React from 'react';
import { useState, useEffect } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ onFilterChange, initialPrice = 300000, initialFilters = {} }) => {
  const [maxPrice, setMaxPrice] = useState(initialPrice);
  const [priceRange, setPriceRange] = useState(initialFilters.price || initialPrice);
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [availability, setAvailability] = useState('');
  const [brand, setBrand] = useState('');
  const [market, setMarket] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    material: [],
    color: [],
    size: [],
    availability: [],
    brand: [],
    market: []
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(products => {
        if (!products || !Array.isArray(products)) return;
        
        const prices = products.map(p => p.price || 0).filter(p => !isNaN(p));
        const maxProductPrice = prices.length > 0 ? Math.max(...prices) : initialPrice;
        
        const calculatedMaxPrice = Math.max(maxProductPrice, initialPrice);
        setMaxPrice(calculatedMaxPrice);

        if (!initialFilters.price) {
          setPriceRange(calculatedMaxPrice);
        }
        const materials = [...new Set(products.map(p => p.material).filter(Boolean))];
        const colors = [...new Set(products.map(p => p.color).filter(Boolean))];
        const sizes = [...new Set(products.map(p => p.dimensions).filter(Boolean))];
        const availabilities = ['В наличии', 'Нет в наличии']; // Assuming this is calculated from stock_quantity
        const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
        const markets = [...new Set(products.map(p => p.shop_id).filter(Boolean))];

        setFilterOptions({
          material: materials,
          color: colors,
          size: sizes,
          availability: availabilities,
          brand: brands,
          market: markets
        });
      })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
  }, [initialPrice, initialFilters.price]);

  const handlePriceChange = (event) => {
    const newPrice = parseInt(event.target.value);
    if (!isNaN(newPrice)) {
      setPriceRange(newPrice);
      onFilterChange({
        price: newPrice,
        material,
        color,
        dimensions: size,
        availability: availability === 'В наличии' ? true : availability === 'Нет в наличии' ? false : null,
        brand,
        shop_id: market
      });
    }
  };

  const handleMaterialChange = (e) => setMaterial(e.target.value);
  const handleColorChange = (e) => setColor(e.target.value);
  const handleSizeChange = (e) => setSize(e.target.value);
  const handleAvailabilityChange = (e) => setAvailability(e.target.value);
  const handleBrandChange = (e) => setBrand(e.target.value);
  const handleMarketChange = (e) => setMarket(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
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
            min="5000"
            max={maxPrice}
            step="5000"
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
            {filterOptions.material.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
        <div>
        <label htmlFor="color">Цвет</label>
          <select id="color" value={color} onChange={handleColorChange}>
            <option value="">Любой</option>
            {filterOptions.color.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
        <div>
        <label htmlFor="size">Размер</label>
          <select id="size" value={size} onChange={handleSizeChange}>
            <option value="">Любой</option>
            {filterOptions.size.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
        <div>
        <label htmlFor="availability">Наличие</label>
          <select id="availability" value={availability} onChange={handleAvailabilityChange}>
            <option value="">Все</option>
            {filterOptions.availability.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
        <div>
        <label htmlFor="brand">Бренд</label>
          <select id="brand" value={brand} onChange={handleBrandChange}>
            <option value="">Любой</option>
            {filterOptions.brand.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
        <div>
        <label htmlFor="market">Магазин</label>
          <select id="market" value={market} onChange={handleMarketChange}>
            <option value="">Любой</option>
            {filterOptions.market.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
        <button type="submit">Применить</button>
      </form>
    </div>
  );
};

export default FilterSidebar;
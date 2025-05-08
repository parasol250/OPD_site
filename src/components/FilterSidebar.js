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
  const [filtersList, setFiltersList] = useState({}); // Объект: { material: ['дерево', 'металл'], color: [...] }

  useEffect(() => {
    fetch('/api/filters')
      .then(res => res.json())
      .then(data => {

        const grouped = {}; // сгруппировать по name
        data.forEach(f => {
          if (!grouped[f.name]) grouped[f.name] = [];
          grouped[f.name].push(f.display_name);
        });
        setFiltersList(grouped);
        
        // Создаем объект с ключами по названиям фильтров
        // const filtersMap = {};
        // data.forEach(f => {
        //   filtersMap[f.name] = f.display_name;
        // });
        // // Устанавливаем значения по умолчанию, если есть
        // // Можно расширить, чтобы получать текущие выбранные значения
        // if (filtersMap['material']) setMaterial(filtersMap['material']);
        // if (filtersMap['color']) setColor(filtersMap['color']);
        // if (filtersMap['size']) setSize(filtersMap['size']);
        // if (filtersMap['availability']) setAvailability(filtersMap['availability']);
        // if (filtersMap['brand']) setBrand(filtersMap['brand']);
        // if (filtersMap['market']) setMarket(filtersMap['market']);
      });
    // При монтировании компонента устанавливаем максимальное значение цены
    setPriceRange(100000);
  }, []);

  // Сохраняем фильтры в базу
  const handleSaveFilters = async () => {
    const filters = [
      { name: 'material', displayName: 'Материал', value: material, productId: null },
      { name: 'color', displayName: 'Цвет', value: color, productId: null },
      { name: 'size', displayName: 'Размер', value: size, productId: null },
      { name: 'availability', displayName: 'Наличие', value: availability, productId: null },
      { name: 'brand', displayName: 'Бренд', value: brand, productId: null },
      { name: 'market', displayName: 'Магазин', value: market, productId: null },
      { name: 'price', displayName: 'Цена', value: priceRange.toString(), productId: null },
    ];

    // Отправляем фильтры на сервер
    for (const filter of filters) {
      await fetch('/api/filters/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filter),
      });
    }
  };
  
  const handlePriceChange = (event) => {
    setPriceRange(parseInt(event.target.value, 10));
  };

  const handleMaterialChange = (e) => setMaterial(e.target.value);
  const handleColorChange = (e) => setColor(e.target.value);
  const handleSizeChange = (e) => setSize(e.target.value);
  const handleAvailabilityChange = (e) => setAvailability(e.target.value);
  const handleBrandChange = (e) => setBrand(e.target.value);
  const handleMarketChange = (e) => setMarket(e.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    onFilterChange({
      price: priceRange,
      material,
      color,
      size,
      availability,
      brand,
      market,
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
            {/* <option value="дерево">Дерево</option>
            <option value="металл">Металл</option>
            <option value="пластик">Пластик</option> */}
            {filtersList['material'] && filtersList['material'].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
        <div>
        <label htmlFor="color">Цвет</label>
          <select id="color" value={color} onChange={handleColorChange}>
            <option value="">Любой</option>
            {filtersList['color'] &&
              filtersList['color'].map((val) => (
                <option key={val} value={val}>{val}</option>
            ))}
            {/* <option value="красный">Красный</option>
            <option value="зеленый">Зеленый</option>
            <option value="черный">Черный</option> */}
          </select>
        </div>
        <div>
        <label htmlFor="size">Размер</label>
          <select id="size" value={size} onChange={handleSizeChange}>
            <option value="">Любой</option>
            {filtersList['size'] &&
              filtersList['size'].map((val) => (
                <option key={val} value={val}>{val}</option>
            ))}
            {/* <option value="маленький">Мини</option>
            <option value="средний">Норм</option>
            <option value="большой">Биги</option> */}
          </select>
        </div>
        <div>
        <label htmlFor="availability">Наличие</label>
          <select id="availability" value={availability} onChange={handleAvailabilityChange}>
            <option value="">Все</option>
            {filtersList['availability'] &&
              filtersList['availability'].map((val) => (
                <option key={val} value={val}>{val}</option>
            ))}
            {/* <option value="есть">В наличии</option>
            <option value="нет">Нет в наличии</option> */}
          </select>
        </div>
        <div>
        <label htmlFor="brand">Бренд</label>
          <select id="brand" value={brand} onChange={handleBrandChange}>
            <option value="">Любой</option>
            {filtersList['brand'] &&
              filtersList['brand'].map((val) => (
                <option key={val} value={val}>{val}</option>
            ))}
            {/* <option value="gucci">gucci</option>
            <option value="prada">prada</option> */}
          </select>
        </div>
        <div>
        <label htmlFor="market">Магазин</label>
          <select id="market" value={market} onChange={handleMarketChange}>
            <option value="">Любой</option>
            {filtersList['market'] &&
              filtersList['market'].map((val) => (
                <option key={val} value={val}>{val}</option>
            ))}
            {/* <option value="ozon">OZON</option>
            <option value="wb">Wildberries</option>
            <option value="yandex">Яндекс.Маркет</option> */}
          </select>
        </div>
        <button type="submit">Применить</button>
      </form>
    </div>
  );
};

export default FilterSidebar;
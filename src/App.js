import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import FilterSidebar from './components/FilterSidebar';
import Popup from './components/popup';
import './App.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

function App() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // Добавили state для поиска
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State для открытия/закрытия popup
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние аутентификации (пример)

  // Имитация API вызова (замените реальным API)
  useEffect(() => {
    const fetchData = async () => {
      //Здесь нужно использовать реальный адрес API
      // const response = await fetch('https://example.com/api/products');
      // const data = await response.json();
      // setProducts(data);

      // Временные данные для примера
      const data = [
        { id: 1, name: 'Диван', price: 50000, image: 'https://via.placeholder.com/150', store: 'Store 1', link: 'https://example.com/product1' },
        { id: 2, name: 'Кресло', price: 25000, image: 'https://via.placeholder.com/150', store: 'Store 2', link: 'https://example.com/product2' },
        { id: 3, name: 'Стол', price: 30000, image: 'https://via.placeholder.com/150', store: 'Store 1', link: 'https://example.com/product3' },
        { id: 4, name: 'Диван угловой', price: 70000, image: 'https://via.placeholder.com/150', store: 'Store 3', link: 'https://example.com/product4' },
      ];
      setProducts(data);
    };

    fetchData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    //Здесь нужно реализовать отправку фильтров на API
    //И обновить стейт products на основе результатов
    console.log('New filters:', newFilters);
  };

  const handleSearch = (term) => { // Добавили обработчик поиска
    setSearchTerm(term);
  };

  const handleOpenPopup = () => { // Функция для открытия всплывающего окна
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => { // Функция для закрытия всплывающего окна
    setIsPopupOpen(false);
  };

  // New function to handle login from Popup
  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsPopupOpen(false);  // close the popup after successful login
  };

    // New function to handle register from Popup (just close popup as example)
  const handleRegister = () => {
    setIsLoggedIn(true);
    setIsPopupOpen(false);  // close the popup after successful register, also login as example
  };

  const filteredProducts = products.filter(product => {
    //Тут нужно реализовать логику фильтрации
    //Основываясь на filters. Будет работать только если
    //Имитированный API возвращает данные в правильном формате
    const searchTermLower = searchTerm.toLowerCase();
    const productNameLower = product.name.toLowerCase();
    return productNameLower.includes(searchTermLower); // Фильтруем по названию

  });

  return (
    <BrowserRouter>
    <div className="app-container">
      <Header onOpenPopup={handleOpenPopup}
      onSearch={handleSearch}
      isLoggedIn={isLoggedIn}
      /> {/* Передаем функцию в Header */}
      <div className="main-content">
        
        <ProductList products={filteredProducts} />
      </div>
      <Popup isOpen={isPopupOpen} onClose={handleClosePopup} /> {/* Рендерим Popup */}
      {/* Conditionally render the Popup, passing login handler */}
      {isPopupOpen && (
        <Popup isOpen={isPopupOpen} onClose={handleClosePopup} onLogin={handleLogin} onRegister={handleRegister}/>
      )}
    </div>
    </BrowserRouter>
  );
};

export default App;


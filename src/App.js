import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
//import FilterSidebar from './components/FilterSidebar';
import Popup from './components/popup';
import './App.css';
//import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
//import CategoryPage from './components/CategoryPage';

function App() {
  const [products, setProducts] = useState([]);
  //const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // Добавили state для поиска
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State для открытия/закрытия popup
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние аутентификации (пример)
  //const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category

  // Имитация API вызова (замените реальным API)
  useEffect(() => {
    const fetchData = async () => {
      //Здесь нужно использовать реальный адрес API
      // const response = await fetch('https://example.com/api/products');
      // const data = await response.json();
      // setProducts(data);

      // Временные данные для примера
      const data = [
        { id: 1, name: 'Диван', price: 50000, image: 'https://via.placeholder.com/150', store: 'Store 1', link: 'https://example.com/product1', category: 'Диваны и кресла' },
        { id: 2, name: 'Кресло', price: 25000, image: 'https://via.placeholder.com/150', store: 'Store 2', link: 'https://example.com/product2', category: 'Диваны и кресла' },
        { id: 3, name: 'Стол', price: 30000, image: 'https://via.placeholder.com/150', store: 'Store 1', link: 'https://example.com/product3', category: 'Столы и стулья' },
        { id: 4, name: 'Диван угловой', price: 70000, image: 'https://via.placeholder.com/150', store: 'Store 3', link: 'https://example.com/product4', category: 'Диваны и кресла' },
        { id: 5, name: 'Шкаф', price: 40000, image: 'https://via.placeholder.com/150', store: 'Store 2', link: 'https://example.com/product5', category: 'Шкафы и стеллажи' },
        { id: 6, name: 'Кровать', price: 60000, image: 'https://via.placeholder.com/150', store: 'Store 1', link: 'https://example.com/product6', category: 'Кровати и матрасы' },
        { id: 7, name: 'Тумбочка', price: 15000, image: 'https://via.placeholder.com/150', store: 'Store 3', link: 'https://example.com/product7', category: 'Тумбы и комоды' },
        { id: 8, name: 'Стул', price: 10000, image: 'https://via.placeholder.com/150', store: 'Store 2', link: 'https://example.com/product8', category: 'Столы и стулья' },
        { id: 9, name: 'Детская кроватка', price: 35000, image: 'https://via.placeholder.com/150', store: 'Store 1', link: 'https://example.com/product9', category: 'Детская мебель' },
        { id: 10, name: 'Комод', price: 28000, image: 'https://via.placeholder.com/150', store: 'Store 3', link: 'https://example.com/product10', category: 'Тумбы и комоды' },
      ];
      setProducts(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  //const handleFilterChange = (newFilters) => {
    //setFilters(newFilters);
    //Здесь нужно реализовать отправку фильтров на API
    //И обновить стейт products на основе результатов
    //console.log('New filters:', newFilters);
  //};

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
    const searchMatch = productNameLower.includes(searchTermLower); // Фильтруем по названию
    // Category filter
    if (selectedCategory) {
      return product.category === selectedCategory && searchMatch; // Search only within selected category
    } else {
      return searchMatch; // Search across all products when no category is selected
    }
  });

  //const handleCategoryClick = (category) => {
    //setSelectedCategory(category); // Set selected category
  //};

  const CategoryPage = () => {
    const { categoryName } = useParams();

    const categoryFilteredProducts = products.filter(product => {
      const searchTermLower = searchTerm.toLowerCase();
      const productNameLower = product.name.toLowerCase();
      const searchMatch = productNameLower.includes(searchTermLower);

      return product.category === categoryName && searchMatch;
    });
    
    return (
      <div>
        <h2>Категория: {categoryName}</h2>
        {categoryFilteredProducts.length > 0 ? (
          <ProductList products={categoryFilteredProducts} />
        ) : (
          <p>Нет товаров в данной категории.</p>
        )}
      </div>
    );
  };

  return (
    <BrowserRouter>
    <div className="app-container">
      <Header
      onOpenPopup={handleOpenPopup}
      onSearch={handleSearch}
      isLoggedIn={isLoggedIn}
      /> {/* Передаем функцию в Header */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<ProductList products={filteredProducts} />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
        </Routes>
      </div>

      {isPopupOpen && (
        <Popup isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onLogin={handleLogin}
        onRegister={handleRegister}/>
      )}
    </div>
    </BrowserRouter>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import FilterSidebar from './components/FilterSidebar';
import Popup from './components/popup';
import './App.css';
import { BrowserRouter, Route, Routes, useNavigate  } from 'react-router-dom';
import CategoryPage from './components/CategoryPage';

function AppContent() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // Добавили state для поиска
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State для открытия/закрытия popup
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние аутентификации (пример)
  const [userRole, setUserRole] = useState(null); // Добавлено состояние для роли пользователя
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // Имитация API вызова (замените реальным API)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Перемешиваем продукты для случайного порядка
        console.log(filters); //////// USELESSSSSS
        setProducts(shuffleArray(data)); // Исправлено: сохраняем shuffledProducts
        setFilteredProducts(shuffleArray(data)); // Инициализируем filteredProducts
        // Перенаправляем на главную только если мы уже не на категории
        if (!window.location.pathname.includes('/category')) {
          navigate('/', { replace: true });
        }
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error); // <---- Добавили console.error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);


  // Применение фильтров к данным
  useEffect(() => {
    let result = [...products];
    
    // Фильтрация по цене
    if (filters.price) {
      result = result.filter(p => p.price <= filters.price);
    }
    
    // Фильтрация по другим параметрам
    if (filters.material) {
      result = result.filter(p => p.material === filters.material);
    }
    // ... другие фильтры
    
    // Фильтрация по поиску
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(result);
  }, [filters, searchTerm, products]);

  // Функция для перемешивания массива (алгоритм Фишера-Йетса)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    //Здесь нужно реализовать отправку фильтров на API
    //И обновить стейт products на основе результатов
    //console.log('New filters:', newFilters);
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
  const handleLogin = async (username) => {
    try {
      console.log('Attempting login with:', username);
      const response = await fetch('http://localhost:5000/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
        setUserRole(data.user.role); // Устанавливаем роль пользователя
        setIsPopupOpen(false);
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed');
    }
  };

    // New function to handle register from Popup (just close popup as example)
  const handleRegister = () => {
    setIsLoggedIn(true);
    setUserRole('user'); // По умолчанию присваиваем роль 'user' при регистрации
    setIsPopupOpen(false);  // close the popup after successful register, also login as example
  };

  // const handleCategorySelect = (category) => {
  //   navigate(`/category/${category}`);
  // };

  if (loading) return <div>Loading...</div>;
  if (error)return <div>Error: {error.message}</div>;

  return (
    <div className="app-container">
      <Header
        onOpenPopup={() => handleOpenPopup()}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
      />
      <div className="main-content">
        <Routes>
          <Route path="/" element={            
            <ProductList 
              products={filteredProducts}
              isLoggedIn={isLoggedIn}
             />
            } />
          <Route 
            path="/category/:categoryName" 
            element={
              <CategoryPage 
                products={products} 
                searchTerm={searchTerm} 
                loading={loading}
                error={error}
                isLoggedIn={isLoggedIn}
              />
            } 
          />
          {/* <Route path="/category/:categoryName" element={<CategoryPage />} /> */}
        </Routes>
      </div>

      {isPopupOpen && (
        <Popup
          isOpen={isPopupOpen}
          onClose={() => handleClosePopup()}
          onLogin={handleLogin}
          onRegister={() => handleRegister()}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
//import FilterSidebar from './components/FilterSidebar';
import Popup from './components/popup';
import './App.css';
import { BrowserRouter, Route, Routes, useParams, useNavigate  } from 'react-router-dom';
import CategoryPage from './components/CategoryPage';

function AppContent() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // Добавили state для поиска
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State для открытия/закрытия popup
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние аутентификации (пример)
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
        setProducts(shuffleArray(data)); // Исправлено: сохраняем shuffledProducts
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

  // const handleCategorySelect = (category) => {
  //   navigate(`/category/${category}`);
  // };

const filteredProducts = products.filter(product => {
  return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  // const searchTermLower = searchTerm.toLowerCase();
  // const productNameLower = product.name.toLowerCase();
  // const searchMatch = productNameLower.includes(searchTermLower); // Фильтруем по названию
  // // Category filter
  // if (selectedCategory) {
  //   return product.category === selectedCategory && searchMatch; // Search only within selected category
  // } else {
  //   return searchMatch; // Search across all products when no category is selected
  // }
  });

  if (loading) return <div>Loading...</div>;
  if (error)return <div>Error: {error.message}</div>;

  return (
    <div className="app-container">
      <Header
        onOpenPopup={() => setIsPopupOpen(true)}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        isLoggedIn={isLoggedIn}
      />
      <div className="main-content">
        <Routes>
          <Route path="/" element={            
            <ProductList products={filteredProducts} />
            } />
          <Route 
            path="/category/:categoryName" 
            element={
              <CategoryPage 
                products={products} 
                searchTerm={searchTerm} 
                loading={loading}
                error={error}
              />
            } 
          />
          {/* <Route path="/category/:categoryName" element={<CategoryPage />} /> */}
        </Routes>
      </div>

      {isPopupOpen && (
        <Popup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onLogin={() => setIsLoggedIn(true)}
          onRegister={() => setIsLoggedIn(true)}
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


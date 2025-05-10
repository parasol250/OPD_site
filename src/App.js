import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import FilterSidebar from './components/FilterSidebar';
import Popup from './components/popup';
import './App.css';
import { BrowserRouter, Route, Routes, useNavigate  } from 'react-router-dom';
import CategoryPage from './components/CategoryPage';
import FavoritesModal from './components/FavouritesModal';

function AppContent() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    return loggedIn && role ? { role } : null;
  });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);
  
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [userRole]);

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

  

  // (алгоритм Фишера-Йетса)
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
  };

  const handleSearch = (term) => {setSearchTerm(term);};
  const handleOpenPopup = () => {setIsPopupOpen(true);};
  const handleClosePopup = () => {setIsPopupOpen(false);};

  const handleLogin = async (username, role) => {
    try {
      //console.log('Attempting login with:', username);
      const response = await fetch('http://localhost:5000/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
        setCurrentUser({ username, role: data.user.role });
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

  const handleRegister = async (username) => {
    try {
    setIsLoggedIn(true);
    setCurrentUser({ username, role: 'user' });
    setUserRole('user');
    setIsPopupOpen(false);
    localStorage.setItem('isLoggedIn', 'true');
    console.log(`User ${username} registered successfully`);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null); // Важно сбросить currentUser
    setUserRole(null);
    setFavorites([]); // Очищаем избранное при выходе
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('favorites');
  };

  // Добавим функции для работы с избранным
  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error)return <div>Error: {error.message}</div>;

  return (
    <div className="app-container">
      <Header
        onOpenPopup={isLoggedIn ? handleLogout : handleOpenPopup}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onShowFavorites={() => setShowFavorites(true)}
      />
      <div className="main-content">
        <Routes>
          <Route path="/" element={            
            <ProductList 
              products={filteredProducts}
              currentUser={currentUser}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
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
                currentUser={currentUser}
              />
            } 
          />
        </Routes>
      </div>
      {showFavorites && (
        <FavoritesModal 
          show={showFavorites}
          onClose={() => setShowFavorites(false)}
          favorites={favorites}
          products={products}
        />
      )}
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
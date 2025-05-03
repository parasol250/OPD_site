// popup.js
import { useState } from 'react';
import React from 'react';
import './popup.css'; // Импортируем стили
import checkCredentials from './Login'

function Popup({ isOpen, onClose, onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true); // State для переключения между входом и регистрацией
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Пожалуйста, введите логин и пароль');
      return;
    }

    try {
      const isValid = await checkCredentials(username, password);
      
      if (isValid) {
        
        setError('Welcome, уважаемый мастер пауков');
        onLogin();  // call login function passed from parent
      } else {
        setError('Неверные учетные данные');
      }
    } catch (err) {
      setError('Ошибка при проверке учетных данных');
      console.error('Login error:', err);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    onRegister(); // call register function passed from parent
  };

  if (!isOpen) {
    return null; // Ничего не отображать, если всплывающее окно закрыто
  }

  return (
    <div className="popup">
      <div className="popup-container">
        <div className="popup-body">
          <h2>{isLogin ? 'Вход в аккаунт' : 'Регистрация'}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}>
            {isLogin && (
              <>
                <input 
                  type="text" 
                  placeholder="Логин" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Пароль" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
            )}
            {!isLogin && (
              <>
                <input type="text" placeholder="Email" />
                <input type="text" placeholder="Имя пользователя" />
                <input type="password" placeholder="Пароль" />
                <input type="password" placeholder="Подтвердите пароль" />
              </>
            )}
            <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
          </form>

          <p onClick={toggleForm} className="toggle-form">
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </p>

          <div className="popup-close" onClick={onClose}>&#10006;</div>
        </div>
      </div>
    </div>
  );
}

export default Popup;

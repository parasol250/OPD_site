// popup.js
import { useState } from 'react';
import React from 'react';
import './popup.css';
import checkCredentials from './Login';
import CryptoJS from 'crypto-js';

function hashString(str) {
  return CryptoJS.SHA256(str).toString();
}

function Popup({ isOpen, onClose, onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Keep raw password in state
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
      // Hash the password before sending
      const hashedPassword = hashString(password);
      const isValid = await checkCredentials(username, hashedPassword);
      
      if (isValid) {
        onLogin(username);  // call login function passed from parent
        onClose();   // close the popup after successful login
      } else {
        setError('Неверные учетные данные');
      }
    } catch (err) {
      setError('Ошибка при проверке учетных данных');
      console.error('Login error:', err);
    }
  };

  const registerUser = async (username, password_hash) => {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password_hash }),
    });
    return await response.json();
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Пожалуйста, введите логин и пароль');
      return;
    }

    try {
      // Hash the password before registration
      const hashedPassword = hashString(password);
      await registerUser(username, hashedPassword)
      await onRegister();
      onClose();
    } catch (err) {
      setError('Ошибка при регистрации');
      console.error('Registration error:', err);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup">
      <div className="popup-container">
        <div className="popup-body">
          <h2>{isLogin ? 'Вход в аккаунт' : 'Регистрация'}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}>
            {isLogin ? (
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
            ) : (
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
                <input 
                  type="password" 
                  placeholder="Подтвердите пароль" 
                  onChange={(e) => {
                    if (e.target.value !== password) {
                      setError('Пароли не совпадают');
                    } else {
                      setError('');
                    }
                  }}
                />
              </>
            )}
            <button type="submit" disabled={!!error}>
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
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

console.log(hashString('Cheese'))

export default Popup;
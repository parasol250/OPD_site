// popup.js
import { useState } from 'react';
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
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setConfirmPassword('');
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
        const userData = await checkCredentials(username, hashedPassword);
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

  const checkUsernameExists = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/api/checkusername?username=${encodeURIComponent(username)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return (await response.json()).exists;
    } catch (err) {
      console.error('Error checking username:', err);
      throw err;
    }
  };

  const registerUser = async (username, password_hash) => {
    try {
      console.log('Registering user:', username);
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password_hash }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка регистрации');
      }

      return await response.json();
    } catch (err) {
      console.error('Registration API error:', err);
      throw err;
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        setError('Ошибка! Пользователь с таким логином уже существует');
        return;
      }

      const hashedPassword = hashString(password);
      const registrationResult = await registerUser(username, hashedPassword);
      
      if (registrationResult.success) {
        await onRegister();
        onClose();
      } else {
        setError(registrationResult.message || 'Ошибка при регистрации');
      }
    } catch (err) {
      setError(err.message || 'Ошибка при регистрации');
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
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (e.target.value !== password) {
                      setError('Пароли не совпадают');
                    } else {
                      setError('');
                    }
                  }}
                />
              </>
            )}
            <button type="submit">
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
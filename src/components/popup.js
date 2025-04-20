// popup.js
import { useState } from 'react';
import React from 'react';
import './popup.css'; // Импортируем стили

function Popup({ isOpen, onClose, onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true); // State для переключения между входом и регистрацией
  //const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  
  //const handleLoginSubmit = (e) => {
    //e.preventDefault();
    // Validate username and password (example validation)
    //if (username === 'user' && password === 'password') {
      //onLogin();  // call login function passed from parent
    //} else {
      //alert('Invalid credentials');
    //}
  //};

    //const handleRegisterSubmit = (e) => {
    //e.preventDefault();
     //onRegister(); // call register function passed from parent
  //};

  if (!isOpen) {
    return null; // Ничего не отображать, если всплывающее окно закрыто
  }

  return (
    <div className="popup">
      <div className="popup-container">
        <div className="popup-body">
        <h2>{isLogin ? 'Вход в аккаунт' : 'Регистрация'}</h2>
          <form onSubmit={(e) => e.preventDefault()}> {/* Предотвращаем перезагрузку */}
            {isLogin && (
              <>
                <input type="text" placeholder="Логин" />
                <input type="password" placeholder="Пароль" value={password}
          onChange={(e) => setPassword(e.target.value)}/>
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

// AdminPanel.js
import React from 'react';
import './AdminPanel.css';

function AdminPanel({ onClose }) {
  return (
    <div className="admin-panel-overlay">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Панель администратора</h2>
        </div>
        <div className="admin-panel-content">
          <button className="close-button" onClick={onClose}>×</button>
          
          <div className="admin-section">
            <h3>Скрейпинг</h3>
            <button className="admin-btn">Обновить данные</button>
          </div>
          
          <div className="admin-section">
            <h3>Управление пользователями</h3>
            <button className="admin-btn">Просмотр пользователей</button>
            <button className="admin-btn">Добавить пользователя</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
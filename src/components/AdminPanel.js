import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import { registerUser, hashString } from './Login.js';

function AdminPanel({ onClose }) {
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (!response.ok) {
        throw new Error('Ошибка загрузки пользователей');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
          },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении пользователя');
      }

      setSuccess('Пользователь успешно удален');
      fetchUsers(); // Обновляем список после удаления
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewUsersClick = () => {
    setShowUsersList(!showUsersList);
    setShowAddUserForm(false);
    setError('');
    setSuccess('');
    if (!showUsersList) {
      fetchUsers();
    }
  };

  const handleAddUserClick = () => {
    setShowAddUserForm(!showAddUserForm);
    setShowUsersList(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    if (!newUser.username || !newUser.password) {
      setError('Все поля обязательны для заполнения');
      return;
    }
  
    try {
      const hashedPassword = hashString(newUser.password);
      const result = await registerUser(
        newUser.username, 
        hashedPassword,
        newUser.role
      );
  
      if (result.success) {
        setSuccess('Пользователь успешно добавлен');
        setNewUser({
          username: '',
          password: '',
          role: 'user'
        });
        setTimeout(() => setShowAddUserForm(false), 2000);
        fetchUsers();
      } else {
        setError(result.message || 'Ошибка при добавлении пользователя');
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="admin-panel-overlay">
      <div className="admin-panel">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="admin-panel-header">
          <h2>Панель администратора</h2>
        </div>
        <div className="admin-panel-content">
          <div className="admin-section">
            <h3>Скрейпинг</h3>
            <button className="admin-btn">Обновить данные</button>
          </div>
          
          <div className="admin-section">
            <h3>Управление пользователями</h3>
            <button 
              className="admin-btn" 
              onClick={handleViewUsersClick}
            >
              {showUsersList ? 'Скрыть пользователей' : 'Просмотр пользователей'}
            </button>
            <button 
              className="admin-btn" 
              onClick={handleAddUserClick}
            >
              {showAddUserForm ? 'Отменить' : 'Добавить пользователя'}
            </button>

            {showUsersList && (
              <div className="users-list">
                <h4>Список пользователей</h4>
                {loadingUsers ? (
                  <p>Загрузка...</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Имя пользователя</th>
                        <th>Роль</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.role}</td>
                          <td>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteUser(user.id)}
                            >
                              Удалить
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {users.length === 0 && !loadingUsers && (
                  <p>Пользователи не найдены</p>
                )}
              </div>
            )}
              
            {showAddUserForm && (
              <form className="add-user-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Логин:</label>
                  <input
                    type="text"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Пароль:</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Роль:</label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                  >
                    <option value="user">Пользователь</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
                <button type="submit" className="admin-btn submit-btn">
                  Сохранить
                </button>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
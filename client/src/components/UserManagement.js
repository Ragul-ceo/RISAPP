import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setMessage('Error fetching users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (editingId) {
        // Update user
        await api.put(`/admin/users/${editingId}`, formData);
        setMessage('✓ User updated successfully!');
      } else {
        // Create new user
        await api.post('/admin/users', formData);
        setMessage('✓ User created successfully!');
      }

      setFormData({ name: '', email: '', password: '', role: 'employee' });
      setShowForm(false);
      setEditingId(null);
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error saving user');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setShowForm(true);
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      setLoading(true);
      try {
        await api.delete(`/admin/users/${userId}`);
        setMessage('✓ User deleted successfully!');
        fetchUsers();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setMessage(err.response?.data?.error || 'Error deleting user');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', email: '', password: '', role: 'employee' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <div>
          <h1>User Management</h1>
          <p>Create, Edit, and Manage Employee Accounts</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {message && (
        <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="user-management-card">
        <div className="user-management-toolbar">
          <button 
            className="add-user-btn"
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
          >
            {showForm ? '✕ Cancel' : '+ Add New User'}
          </button>
        </div>

        {showForm && (
          <div className="user-form">
            <h2>{editingId ? 'Edit User' : 'Create New User'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password {editingId ? '(leave blank to keep current)' : '*'}</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingId}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="employee">Employee</option>
                    <option value="hr">HR</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="form-buttons">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingId ? 'Update User' : 'Create User'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="users-list">
          <h2>All Users ({users.length})</h2>
          
          {loading && !showForm ? (
            <div className="loading">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="no-data">No users found</div>
          ) : (
            <div className="table-responsive">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(user)}
                          disabled={loading}
                          title="Edit user"
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={loading}
                          title="Delete user"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;

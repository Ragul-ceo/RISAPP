import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CheckIn from './components/CheckIn';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/checkin"
          element={
            <PrivateRoute requiredRole="employee">
              <CheckIn />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="hr">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute requiredRole="hr">
              <UserManagement />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

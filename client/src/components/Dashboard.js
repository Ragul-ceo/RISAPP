import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Dashboard.css';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSummary();
    fetchRecords();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get('/dashboard/summary');
      setSummary(response.data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const fetchRecords = async (start = '', end = '') => {
    setLoading(true);
    try {
      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;

      const response = await api.get('/dashboard/attendance', { params });
      setRecords(response.data);
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchRecords(startDate, endDate);
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await api.post(
        '/dashboard/export',
        { startDate, endDate },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);

      setMessage('✓ Report exported successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error exporting report');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>HR Dashboard</h1>
          <p>Employee Attendance Management</p>
        </div>
        <div className="header-buttons">
          <Link to="/users" className="manage-users-btn">👥 Manage Users</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {summary && (
        <div className="summary-cards">
          <div className="card">
            <div className="card-label">Total Employees</div>
            <div className="card-value">{summary.totalEmployees}</div>
          </div>
          <div className="card">
            <div className="card-label">Checked In Today</div>
            <div className="card-value">{summary.checkedInToday}</div>
          </div>
          <div className="card">
            <div className="card-label">Checked Out Today</div>
            <div className="card-value">{summary.checkedOutToday}</div>
          </div>
          <div className="card">
            <div className="card-label">Still Present</div>
            <div className="card-value">{summary.checkedInToday - summary.checkedOutToday}</div>
          </div>
        </div>
      )}

      <div className="filters-section">
        <h2>Filter Records</h2>
        <div className="filter-group">
          <div className="filter-input">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="filter-input">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button className="filter-btn" onClick={handleFilter} disabled={loading}>
              {loading ? 'Loading...' : 'Filter'}
            </button>
            <button className="export-btn" onClick={handleExport} disabled={loading}>
              📥 Export to Excel
            </button>
          </div>
        </div>
      </div>

      <div className="records-section">
        <h2>Attendance Records</h2>
        <div className="table-responsive">
          <table className="records-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Check-in Time</th>
                <th>Check-out Time</th>
                <th>Check-in Location</th>
                <th>Check-out Location</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">No records found</td>
                </tr>
              ) : (
                records.map((record, idx) => (
                  <tr key={idx}>
                    <td>{record.name}</td>
                    <td>{record.email}</td>
                    <td>{new Date(record.check_in_time).toLocaleString()}</td>
                    <td>{record.check_out_time ? new Date(record.check_out_time).toLocaleString() : '-'}</td>
                    <td>
                      <small>
                        {record.check_in_latitude && record.check_in_longitude
                          ? `${record.check_in_latitude.toFixed(4)}, ${record.check_in_longitude.toFixed(4)}`
                          : '-'}
                      </small>
                    </td>
                    <td>
                      <small>
                        {record.check_out_latitude && record.check_out_longitude
                          ? `${record.check_out_latitude.toFixed(4)}, ${record.check_out_longitude.toFixed(4)}`
                          : '-'}
                      </small>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

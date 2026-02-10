import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './CheckIn.css';

function CheckIn() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserInfo(JSON.parse(user));
    }
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await api.get('/attendance/status');
      setStatus(response.data);
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  };

  const getGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setMessage('');

    try {
      const location = await getGeolocation();
      await api.post('/attendance/checkin', location);
      setMessage('✓ Check-in successful!');
      fetchStatus();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setMessage('');

    try {
      const location = await getGeolocation();
      await api.post('/attendance/checkout', location);
      setMessage('✓ Check-out successful!');
      fetchStatus();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Check-out failed');
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
    <div className="checkin-container">
      <div className="checkin-header">
        <div>
          <h1>Employee Check-in/Check-out</h1>
          {userInfo && <p>Welcome, {userInfo.name}!</p>}
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="checkin-card">
        {message && (
          <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {status && (
          <div className="status-info">
            <div className="status-item">
              <span className="label">Check-in Status:</span>
              <span className={`value ${status.checkedIn ? 'active' : 'inactive'}`}>
                {status.checkedIn ? '✓ Checked In' : '✗ Not Checked In'}
              </span>
              {status.checkInTime && (
                <div className="time">{new Date(status.checkInTime).toLocaleTimeString()}</div>
              )}
            </div>

            <div className="status-item">
              <span className="label">Check-out Status:</span>
              <span className={`value ${status.checkedOut ? 'active' : 'inactive'}`}>
                {status.checkedOut ? '✓ Checked Out' : '✗ Not Checked Out'}
              </span>
              {status.checkOutTime && (
                <div className="time">{new Date(status.checkOutTime).toLocaleTimeString()}</div>
              )}
            </div>
          </div>
        )}

        <div className="button-group">
          <button
            className="checkin-btn"
            onClick={handleCheckIn}
            disabled={loading || (status && status.checkedIn)}
          >
            {loading && !status?.checkedIn ? 'Processing...' : 'Check In'}
          </button>

          <button
            className="checkout-btn"
            onClick={handleCheckOut}
            disabled={loading || !status?.checkedIn || (status && status.checkedOut)}
          >
            {loading && status?.checkedIn && !status?.checkedOut ? 'Processing...' : 'Check Out'}
          </button>
        </div>

        <div className="info-box">
          <p>📍 Location (GPS) will be recorded with your check-in and check-out.</p>
          <p>Make sure location access is enabled in your browser.</p>
        </div>
      </div>
    </div>
  );
}

export default CheckIn;

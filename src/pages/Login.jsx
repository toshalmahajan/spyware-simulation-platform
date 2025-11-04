import React, { useState, useEffect } from 'react';
import { login, logActivity, getCurrentUser } from '../utils/auth';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    const user = getCurrentUser();
    if (user) {
      onLogin(user);
    }
  }, [onLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(formData.username, formData.password);
      logActivity('USER_LOGIN', { username: user.username });
      onLogin(user);
    } catch (err) {
      setError(err.message);
      logActivity('LOGIN_FAILED', { username: formData.username, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '2.5rem',
        borderRadius: '16px',
        border: '1px solid #333',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h1 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
            Security Operations Center
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Spyware Simulation Platform
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#ccc',
              marginBottom: '0.5rem',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              placeholder="Enter your username"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              color: '#ccc',
              marginBottom: '0.5rem',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: loading 
                ? '#6b7280' 
                : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '🔐 Signing In...' : '🚀 Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h4 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Demo Credentials:
          </h4>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: '1.6' }}>
            <div><strong>Admin:</strong> admin / admin123</div>
            <div><strong>Operator:</strong> operator / operator123</div>
            <div><strong>Viewer:</strong> viewer / viewer123</div>
          </div>
        </div>

        {/* Security Notice */}
        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.7rem',
          color: '#6b7280'
        }}>
          �� Authorized Use Only • All activities are logged and monitored
        </div>
      </div>
    </div>
  );
};

export default Login;

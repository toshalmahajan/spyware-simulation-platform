import React, { useState, useEffect } from 'react';
import { getCurrentUser, logout, logActivity, hasPermission, ROLES } from './utils/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Simulations from './pages/Simulations';
import Agents from './pages/Agents';
import Reports from './pages/Reports';
import UserManagement from './components/UserManagement';
import SecuritySettings from './components/SecuritySettings';
import ThreatIntelligence from './components/ThreatIntelligence';
import SIEMIntegration from './components/SIEMIntegration';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      logActivity('SESSION_RESUMED', { username: currentUser.username });
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveTab('dashboard');
    logActivity('APP_ACCESS', { username: userData.username });
  };

  const handleLogout = () => {
    logActivity('USER_LOGOUT', { username: user?.username });
    logout();
    setUser(null);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    logActivity('NAVIGATION', { from: activeTab, to: tabId, username: user?.username });
  };

  const tabs = [
    { id: 'dashboard', label: '🏠 Dashboard', component: <Dashboard />, roles: [ROLES.VIEWER, ROLES.OPERATOR, ROLES.ADMIN] },
    { id: 'simulations', label: '🚀 Simulations', component: <Simulations />, roles: [ROLES.OPERATOR, ROLES.ADMIN] },
    { id: 'agents', label: '🖥️ Agents', component: <Agents />, roles: [ROLES.OPERATOR, ROLES.ADMIN] },
    { id: 'reports', label: '📊 Reports', component: <Reports />, roles: [ROLES.VIEWER, ROLES.OPERATOR, ROLES.ADMIN] },
    { id: 'threats', label: '🧠 Threat Intel', component: <ThreatIntelligence />, roles: [ROLES.OPERATOR, ROLES.ADMIN] },
    { id: 'siem', label: '🔌 SIEM Integration', component: <SIEMIntegration />, roles: [ROLES.ADMIN] },
    { id: 'users', label: '👥 User Management', component: <UserManagement />, roles: [ROLES.ADMIN] },
    { id: 'security', label: '🔒 Security Settings', component: <SecuritySettings />, roles: [ROLES.ADMIN] }
  ];

  const filteredTabs = tabs.filter(tab => 
    tab.roles.some(role => hasPermission(role))
  );

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2>Loading Security Platform...</h2>
          <p style={{ color: '#9ca3af' }}>Initializing secure session</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        padding: '1rem 2rem',
        borderBottom: '1px solid #333',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              🔒 Security Operations Center
            </h1>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>
              Enterprise Spyware Simulation Platform • Welcome, {user.name} ({user.role})
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: user.role === ROLES.ADMIN ? 'rgba(239, 68, 68, 0.2)' : 
                         user.role === ROLES.OPERATOR ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: user.role === ROLES.ADMIN ? '#ef4444' : 
                     user.role === ROLES.OPERATOR ? '#3b82f6' : '#10b981',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '500',
              border: `1px solid ${user.role === ROLES.ADMIN ? '#ef4444' : 
                       user.role === ROLES.OPERATOR ? '#3b82f6' : '#10b981'}`
            }}>
              {user.role.toUpperCase()}
            </div>
            
            <button 
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid #ef4444',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
        padding: '0 2rem',
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid #333',
        overflowX: 'auto'
      }}>
        {filteredTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={{
              padding: '1rem 1.5rem',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#9ca3af',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              borderRadius: '8px 8px 0 0',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        background: '#0f0f0f',
        minHeight: 'calc(100vh - 120px)',
        color: 'white'
      }}>
        {filteredTabs.find(tab => tab.id === activeTab)?.component}
      </main>
    </div>
  );
}

export default App;

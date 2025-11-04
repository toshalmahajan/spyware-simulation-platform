import React, { useState } from 'react';
import Simulations from './pages/Simulations';
import Agents from './pages/Agents';
import Reports from './pages/Reports';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('simulations');

  const tabs = [
    { id: 'simulations', label: '🚀 Simulations', component: <Simulations /> },
    { id: 'agents', label: '🖥️ Agents', component: <Agents /> },
    { id: 'reports', label: '📊 Reports', component: <Reports /> }
  ];

  return (
    <div className="App">
      {/* Header */}
      <header style={{
        background: '#1e293b',
        color: 'white',
        padding: '1rem 2rem',
        borderBottom: '3px solid #2563eb'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
          🔒 Security Operations Dashboard
        </h1>
      </header>

      {/* Navigation */}
      <nav style={{
        background: 'white',
        padding: '0 2rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        gap: '0.5rem'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 1.5rem',
              background: activeTab === tab.id ? '#2563eb' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        background: '#f8fafc',
        minHeight: 'calc(100vh - 120px)'
      }}>
        {tabs.find(tab => tab.id === activeTab)?.component}
      </main>
    </div>
  );
}

export default App;

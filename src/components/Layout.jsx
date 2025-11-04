import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const Layout = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', description: 'Overview & Analytics' },
    { path: '/simulations', label: 'Simulations', icon: '🛠️', description: 'Manage Tests' },
    { path: '/agents', label: 'Agents', icon: '🤖', description: 'Monitor Agents' },
    { path: '/reports', label: 'Reports', icon: '📋', description: 'View Reports' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '260px', 
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: '1rem 0'
      }}>
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: 'white'
            }}>
              S
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>SpySim Pro</h2>
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '0.75rem', 
                margin: 0,
                background: 'rgba(255,255,255,0.1)',
                padding: '0.125rem 0.5rem',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                v2.0.0
              </p>
            </div>
          </div>
        </div>
        
        <nav style={{ padding: '1rem 0' }}>
          {navItems.map(item => (
            <Link 
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                margin: '0.125rem 0.75rem',
                background: location.pathname === item.path ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                borderLeft: location.pathname === item.path ? '4px solid #2563eb' : '4px solid transparent',
                borderRadius: '0 8px 8px 0',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: '500' }}>{item.label}</div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#94a3b8',
                  opacity: location.pathname === item.path ? 1 : 0.7
                }}>
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </nav>
        
        {/* User Section */}
        <div style={{ 
          padding: '1.5rem', 
          marginTop: 'auto',
          borderTop: '1px solid #334155'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '1rem'
            }}>
              A
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>Admin</div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Administrator</div>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            style={{ 
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        background: '#f8fafc', 
        minHeight: '100vh',
        padding: '2rem',
        overflow: 'auto'
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

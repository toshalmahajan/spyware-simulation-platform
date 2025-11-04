import React, { useState, useEffect } from 'react';
import { getAuditLogs, hasPermission, ROLES, logActivity } from '../utils/auth';

const UserManagement = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('logs');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = () => {
    const logs = getAuditLogs();
    setAuditLogs(logs);
  };

  const clearLogs = () => {
    if (window.confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
      localStorage.removeItem('audit_logs');
      setAuditLogs([]);
      logActivity('AUDIT_LOGS_CLEARED');
      alert('Audit logs cleared successfully.');
    }
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(auditLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    logActivity('AUDIT_LOGS_EXPORTED');
  };

  if (!hasPermission(ROLES.ADMIN)) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #333',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛔</div>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Access Denied</h3>
        <p style={{ color: '#9ca3af' }}>
          You need administrator privileges to access user management.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: 'white' }}>User Management & Audit</h2>

      {/* Tabs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #333',
          paddingBottom: '0.5rem'
        }}>
          <button
            onClick={() => setActiveTab('logs')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'logs' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'transparent',
              color: activeTab === 'logs' ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            📋 Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'users' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'transparent',
              color: activeTab === 'users' ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            👥 User Management
          </button>
        </div>
      </div>

      {/* Audit Logs */}
      {activeTab === 'logs' && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', margin: 0 }}>System Audit Logs</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={exportLogs}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                📤 Export Logs
              </button>
              <button
                onClick={clearLogs}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                🗑️ Clear Logs
              </button>
            </div>
          </div>

          <div style={{ maxHeight: '500px', overflow: 'auto' }}>
            {auditLogs.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>
                No audit logs found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {auditLogs.map((log, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ color: 'white', fontWeight: '500' }}>{log.action}</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', color: '#ccc' }}>
                      <div>
                        <strong>User:</strong> {log.username} (ID: {log.userId})
                      </div>
                      <div>
                        <strong>IP:</strong> {log.ipAddress}
                      </div>
                    </div>
                    {Object.keys(log.details).length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                          <strong>Details:</strong> {JSON.stringify(log.details)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Management */}
      {activeTab === 'users' && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>User Accounts</h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { username: 'admin', role: 'Administrator', lastLogin: '2024-11-04 14:30:22', status: 'Active' },
              { username: 'operator', role: 'Security Operator', lastLogin: '2024-11-04 13:15:10', status: 'Active' },
              { username: 'viewer', role: 'Security Viewer', lastLogin: '2024-11-04 10:45:33', status: 'Active' }
            ].map((user, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ color: 'white', fontWeight: '500' }}>{user.username}</div>
                <div>
                  <span style={{
                    background: user.role === 'Administrator' ? 'rgba(239, 68, 68, 0.2)' : 
                               user.role === 'Security Operator' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: user.role === 'Administrator' ? '#ef4444' : 
                           user.role === 'Security Operator' ? '#3b82f6' : '#10b981',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {user.role}
                  </span>
                </div>
                <div style={{ color: '#ccc', fontSize: '0.9rem' }}>{user.lastLogin}</div>
                <div style={{ color: '#10b981', fontWeight: '500' }}>{user.status}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    border: '1px solid #3b82f6',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}>
                    Edit
                  </button>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}>
                    Reset
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              ➕ Add New User
            </button>
            <button style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              ⚙️ Role Management
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

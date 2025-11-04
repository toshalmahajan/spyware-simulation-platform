import React, { useState, useEffect } from 'react';
import { hasPermission, ROLES, logActivity } from '../utils/auth';
import { encryptionService } from '../utils/encryption';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    sessionTimeout: 60,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    encryptionEnabled: true,
    auditLogRetention: 90,
    twoFactorAuth: false,
    ipWhitelist: [],
    rateLimiting: {
      enabled: true,
      maxRequestsPerMinute: 100
    }
  });
  
  const [newIp, setNewIp] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('security_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load security settings:', error);
      }
    }
  }, []);

  const saveSettings = (newSettings) => {
    const updatedSettings = { ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('security_settings', JSON.stringify(updatedSettings));
    logActivity('SECURITY_SETTINGS_UPDATED', { settings: updatedSettings });
    alert('Security settings saved successfully!');
  };

  const handleAddIp = () => {
    if (newIp && /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(newIp)) {
      const updatedSettings = {
        ...settings,
        ipWhitelist: [...settings.ipWhitelist, newIp]
      };
      saveSettings(updatedSettings);
      setNewIp('');
    } else {
      alert('Please enter a valid IP address.');
    }
  };

  const handleRemoveIp = (ipToRemove) => {
    const updatedSettings = {
      ...settings,
      ipWhitelist: settings.ipWhitelist.filter(ip => ip !== ipToRemove)
    };
    saveSettings(updatedSettings);
  };

  const handleEncryptionTest = () => {
    const testData = {
      message: 'This is a test of the encryption system',
      timestamp: new Date().toISOString(),
      sensitive: 'confidential-information-12345'
    };
    
    try {
      const encrypted = encryptionService.encrypt(testData);
      const decrypted = encryptionService.decrypt(encrypted);
      
      alert(`🔐 Encryption Test Successful!\n\nOriginal: ${testData.message}\nEncrypted: ${encrypted.encryptedData.substring(0, 50)}...\nDecrypted: ${decrypted.message}`);
      
      logActivity('ENCRYPTION_TEST', { 
        success: true,
        originalLength: JSON.stringify(testData).length,
        encryptedLength: encrypted.encryptedData.length
      });
    } catch (error) {
      alert('❌ Encryption test failed: ' + error.message);
      logActivity('ENCRYPTION_TEST', { success: false, error: error.message });
    }
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
          Administrator privileges required to access security settings.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: 'white' }}>Security Settings</h2>

      {/* Tabs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #333',
          paddingBottom: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {['general', 'access', 'encryption', 'policies'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === tab ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'transparent',
                color: activeTab === tab ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem'
              }}
            >
              {tab === 'general' && '⚙️ General'}
              {tab === 'access' && '🔐 Access Control'}
              {tab === 'encryption' && '🔒 Encryption'}
              {tab === 'policies' && '📋 Security Policies'}
            </button>
          ))}
        </div>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>General Security Settings</h3>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontWeight: '500' }}>
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                style={{
                  width: '200px',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: 'white'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ccc', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  checked={settings.rateLimiting.enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    rateLimiting: { ...settings.rateLimiting, enabled: e.target.checked }
                  })}
                  style={{ transform: 'scale(1.2)' }}
                />
                Enable Rate Limiting
              </label>
              
              {settings.rateLimiting.enabled && (
                <div style={{ marginLeft: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>
                    Max Requests Per Minute
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={settings.rateLimiting.maxRequestsPerMinute}
                    onChange={(e) => setSettings({
                      ...settings,
                      rateLimiting: { ...settings.rateLimiting, maxRequestsPerMinute: parseInt(e.target.value) }
                    })}
                    style={{
                      width: '200px',
                      padding: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      color: 'white'
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ccc' }}>
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                  style={{ transform: 'scale(1.2)' }}
                />
                Enable Two-Factor Authentication (2FA)
              </label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontWeight: '500' }}>
                Audit Log Retention (days)
              </label>
              <input
                type="number"
                min="7"
                max="365"
                value={settings.auditLogRetention}
                onChange={(e) => setSettings({ ...settings, auditLogRetention: parseInt(e.target.value) })}
                style={{
                  width: '200px',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: 'white'
                }}
              />
            </div>
          </div>

          <button
            onClick={() => saveSettings(settings)}
            style={{
              marginTop: '2rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            💾 Save General Settings
          </button>
        </div>
      )}

      {/* Access Control */}
      {activeTab === 'access' && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>IP Access Control</h3>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', color: '#ccc', fontWeight: '500' }}>
              Add IP to Whitelist
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                placeholder="192.168.1.1"
                style={{
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: 'white',
                  width: '200px'
                }}
              />
              <button
                onClick={handleAddIp}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Add IP
              </button>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ccc', marginBottom: '1rem' }}>Current IP Whitelist</h4>
            {settings.ipWhitelist.length === 0 ? (
              <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No IP addresses in whitelist</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {settings.ipWhitelist.map((ip, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <span style={{ color: 'white', fontFamily: 'monospace' }}>{ip}</span>
                    <button
                      onClick={() => handleRemoveIp(ip)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid #f59e0b' }}>
            <h4 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>⚠️ Security Notice</h4>
            <p style={{ color: '#fbbf24', fontSize: '0.9rem', margin: 0 }}>
              When IP whitelisting is enabled, access will be restricted to only the IP addresses listed above. 
              Make sure to include your current IP address to avoid being locked out.
            </p>
          </div>
        </div>
      )}

      {/* Encryption Settings */}
      {activeTab === 'encryption' && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Encryption Settings</h3>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ccc', marginBottom: '1.5rem' }}>
              <input
                type="checkbox"
                checked={settings.encryptionEnabled}
                onChange={(e) => setSettings({ ...settings, encryptionEnabled: e.target.checked })}
                style={{ transform: 'scale(1.2)' }}
              />
              Enable Data Encryption
            </label>
            
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginLeft: '2rem' }}>
              When enabled, sensitive data will be encrypted before storage. This includes agent configurations, 
              simulation results, and audit logs.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#ccc', marginBottom: '1rem' }}>Encryption Status</h4>
            <div style={{
              padding: '1rem',
              background: settings.encryptionEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              border: `1px solid ${settings.encryptionEnabled ? '#10b981' : '#f59e0b'}`,
              borderRadius: '6px',
              color: settings.encryptionEnabled ? '#10b981' : '#f59e0b'
            }}>
              {settings.encryptionEnabled ? '🔒 Encryption is ENABLED' : '⚠️ Encryption is DISABLED'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleEncryptionTest}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              🔐 Test Encryption
            </button>
            
            <button
              onClick={() => saveSettings(settings)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              💾 Save Encryption Settings
            </button>
          </div>
        </div>
      )}

      {/* Security Policies */}
      {activeTab === 'policies' && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Password Policy</h3>
          
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontWeight: '500' }}>
                Minimum Password Length
              </label>
              <input
                type="number"
                min="6"
                max="20"
                value={settings.passwordPolicy.minLength}
                onChange={(e) => setSettings({
                  ...settings,
                  passwordPolicy: { ...settings.passwordPolicy, minLength: parseInt(e.target.value) }
                })}
                style={{
                  width: '200px',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: 'white'
                }}
              />
            </div>

            {[
              { key: 'requireUppercase', label: 'Require Uppercase Letters' },
              { key: 'requireLowercase', label: 'Require Lowercase Letters' },
              { key: 'requireNumbers', label: 'Require Numbers' },
              { key: 'requireSpecialChars', label: 'Require Special Characters' }
            ].map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ccc' }}>
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy[key]}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, [key]: e.target.checked }
                  })}
                  style={{ transform: 'scale(1.2)' }}
                />
                {label}
              </label>
            ))}
          </div>

          <button
            onClick={() => saveSettings(settings)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            💾 Save Password Policy
          </button>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid #3b82f6' }}>
            <h4 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>ℹ️ Policy Information</h4>
            <p style={{ color: '#93c5fd', fontSize: '0.9rem', margin: 0 }}>
              These password policies will be enforced for all new user accounts and password changes. 
              Existing passwords will not be affected until users change them.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;

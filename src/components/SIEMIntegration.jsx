import React, { useState, useEffect } from 'react';
import { hasPermission, ROLES, logActivity } from '../utils/auth';
import { mlEngine } from '../utils/mlEngine';

const SIEMIntegration = () => {
  const [integrations, setIntegrations] = useState([]);
  const [activeIntegration, setActiveIntegration] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = () => {
    const savedIntegrations = JSON.parse(localStorage.getItem('siem_integrations') || '[]');
    setIntegrations(savedIntegrations);
  };

  const saveIntegrations = (newIntegrations) => {
    setIntegrations(newIntegrations);
    localStorage.setItem('siem_integrations', JSON.stringify(newIntegrations));
  };

  const siemProviders = [
    { id: 'splunk', name: 'Splunk', logo: '🔍', docs: 'https://splunk.com' },
    { id: 'elastic', name: 'Elastic SIEM', logo: '⚡', docs: 'https://elastic.co' },
    { id: 'qradar', name: 'QRadar', logo: '🔷', docs: 'https://ibm.com' },
    { id: 'arcsight', name: 'ArcSight', logo: '🛡️', docs: 'https://microfocus.com' },
    { id: 'sentinel', name: 'Azure Sentinel', logo: '☁️', docs: 'https://azure.com' },
    { id: 'custom', name: 'Custom Webhook', logo: '🔧', docs: '' }
  ];

  const addIntegration = (providerId) => {
    const provider = siemProviders.find(p => p.id === providerId);
    const newIntegration = {
      id: `siem_${Date.now()}`,
      provider: providerId,
      name: `${provider.name} Integration`,
      enabled: false,
      config: {},
      createdAt: new Date().toISOString(),
      lastTest: null,
      stats: { sent: 0, failed: 0 }
    };

    const newIntegrations = [...integrations, newIntegration];
    saveIntegrations(newIntegrations);
    setActiveIntegration(newIntegration.id);
    
    logActivity('SIEM_INTEGRATION_ADDED', { provider: providerId });
  };

  const updateIntegration = (integrationId, updates) => {
    const newIntegrations = integrations.map(integration =>
      integration.id === integrationId ? { ...integration, ...updates } : integration
    );
    saveIntegrations(newIntegrations);
  };

  const deleteIntegration = (integrationId) => {
    const newIntegrations = integrations.filter(integration => integration.id !== integrationId);
    saveIntegrations(newIntegrations);
    
    if (activeIntegration === integrationId) {
      setActiveIntegration(null);
    }
    
    logActivity('SIEM_INTEGRATION_REMOVED', { integrationId });
  };

  const testIntegration = async (integration) => {
    setIsTesting(true);
    setTestResults(null);

    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.3; // 70% success rate for demo
    const results = {
      success,
      timestamp: new Date().toISOString(),
      message: success 
        ? '✅ Integration test successful - SIEM connection established'
        : '❌ Integration test failed - check configuration',
      details: success 
        ? { responseTime: '245ms', endpoint: 'https://siem.example.com/api/alerts' }
        : { error: 'Connection timeout', suggestion: 'Verify API credentials and network connectivity' }
    };

    setTestResults(results);
    setIsTesting(false);

    if (success) {
      updateIntegration(integration.id, { 
        lastTest: new Date().toISOString(),
        enabled: true 
      });
    }

    logActivity('SIEM_INTEGRATION_TESTED', { 
      integrationId: integration.id, 
      success,
      provider: integration.provider 
    });
  };

  const sendTestAlert = async (integration) => {
    const testAlert = {
      id: `test_alert_${Date.now()}`,
      timestamp: new Date().toISOString(),
      severity: 'HIGH',
      source: 'Spyware Simulation Platform',
      message: 'Test security alert from SIEM integration',
      details: {
        type: 'TEST_ALERT',
        simulation: 'SIEM Integration Test',
        user: 'system',
        riskScore: 0.85
      }
    };

    // Simulate sending alert
    await new Promise(resolve => setTimeout(resolve, 1000));

    alert(`🚨 Test alert sent to ${integration.name}\n\nThis alert would be delivered to your SIEM system for processing and correlation.`);

    logActivity('SIEM_TEST_ALERT_SENT', { 
      integrationId: integration.id,
      alertId: testAlert.id 
    });
  };

  const getProviderConfig = (providerId) => {
    const configs = {
      splunk: [
        { key: 'hecUrl', label: 'HEC URL', type: 'url', required: true },
        { key: 'hecToken', label: 'HEC Token', type: 'password', required: true },
        { key: 'index', label: 'Index', type: 'text', required: false }
      ],
      elastic: [
        { key: 'elasticUrl', label: 'Elastic URL', type: 'url', required: true },
        { key: 'apiKey', label: 'API Key', type: 'password', required: true },
        { key: 'index', label: 'Index Pattern', type: 'text', required: true }
      ],
      custom: [
        { key: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true },
        { key: 'secret', label: 'Secret', type: 'password', required: false },
        { key: 'format', label: 'Data Format', type: 'select', options: ['JSON', 'XML'], required: true }
      ]
    };

    return configs[providerId] || configs.custom;
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
          Administrator privileges required to manage SIEM integrations.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: 'white' }}>SIEM Integrations</h2>
      <p style={{ color: '#ccc', marginBottom: '2rem' }}>
        Connect with Security Information and Event Management (SIEM) systems for centralized threat monitoring
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Integration List */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', margin: 0 }}>Connected SIEMs</h3>
            <span style={{ 
              background: integrations.filter(i => i.enabled).length > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: integrations.filter(i => i.enabled).length > 0 ? '#10b981' : '#f59e0b',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}>
              {integrations.filter(i => i.enabled).length} Active
            </span>
          </div>

          {integrations.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔌</div>
              <p>No SIEM integrations configured</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {integrations.map(integration => (
                <div
                  key={integration.id}
                  onClick={() => setActiveIntegration(integration.id)}
                  style={{
                    padding: '1rem',
                    background: activeIntegration === integration.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: activeIntegration === integration.id ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>
                        {siemProviders.find(p => p.id === integration.provider)?.logo}
                      </span>
                      <span style={{ color: 'white', fontWeight: '500' }}>{integration.name}</span>
                    </div>
                    <div style={{ 
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: integration.enabled ? '#10b981' : '#6b7280'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af' }}>
                    <span>Alerts: {integration.stats.sent}</span>
                    <span>{integration.lastTest ? new Date(integration.lastTest).toLocaleDateString() : 'Never tested'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ color: '#ccc', marginBottom: '1rem' }}>Add New Integration</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
              {siemProviders.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => addIntegration(provider.id)}
                  style={{
                    padding: '1rem 0.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{provider.logo}</span>
                  <span style={{ fontSize: '0.7rem' }}>{provider.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Configuration */}
        {activeIntegration && (
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            {integrations.map(integration => 
              integration.id === activeIntegration && (
                <div key={integration.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'white', margin: 0 }}>{integration.name}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => testIntegration(integration)}
                        disabled={isTesting}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: isTesting ? 'not-allowed' : 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        {isTesting ? '🔄 Testing...' : '🧪 Test Connection'}
                      </button>
                      <button
                        onClick={() => deleteIntegration(integration.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {/* Configuration Form */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ccc', marginBottom: '1rem' }}>Configuration</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {getProviderConfig(integration.provider).map(field => (
                        <div key={field.key}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontSize: '0.9rem' }}>
                            {field.label} {field.required && '*'}
                          </label>
                          {field.type === 'select' ? (
                            <select
                              value={integration.config[field.key] || ''}
                              onChange={(e) => updateIntegration(integration.id, {
                                config: { ...integration.config, [field.key]: e.target.value }
                              })}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid #444',
                                borderRadius: '6px',
                                color: 'white'
                              }}
                            >
                              <option value="">Select {field.label}</option>
                              {field.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              value={integration.config[field.key] || ''}
                              onChange={(e) => updateIntegration(integration.id, {
                                config: { ...integration.config, [field.key]: e.target.value }
                              })}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid #444',
                                borderRadius: '6px',
                                color: 'white'
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test Results */}
                  {testResults && (
                    <div style={{
                      padding: '1rem',
                      background: testResults.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: `1px solid ${testResults.success ? '#10b981' : '#ef4444'}`,
                      borderRadius: '8px',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ 
                        color: testResults.success ? '#10b981' : '#ef4444',
                        fontWeight: '500',
                        marginBottom: '0.5rem'
                      }}>
                        {testResults.message}
                      </div>
                      {testResults.details && (
                        <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                          {Object.entries(testResults.details).map(([key, value]) => (
                            <div key={key}>{key}: {value}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Integration Actions */}
                  {integration.enabled && (
                    <div>
                      <h4 style={{ color: '#ccc', marginBottom: '1rem' }}>Actions</h4>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                          onClick={() => sendTestAlert(integration)}
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
                          🚨 Send Test Alert
                        </button>
                        <button
                          onClick={() => updateIntegration(integration.id, { enabled: false })}
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#f59e0b',
                            border: '1px solid #f59e0b',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          ⏸️ Disable
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Integration Statistics */}
                  <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #333' }}>
                    <h4 style={{ color: '#ccc', marginBottom: '1rem' }}>Statistics</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', color: '#ccc' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Alerts Sent</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                          {integration.stats.sent}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Failed</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                          {integration.stats.failed}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Success Rate</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                          {integration.stats.sent > 0 
                            ? `${((integration.stats.sent - integration.stats.failed) / integration.stats.sent * 100).toFixed(1)}%`
                            : '0%'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SIEMIntegration;

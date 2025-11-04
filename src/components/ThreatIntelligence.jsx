import React, { useState, useEffect } from 'react';
import { mlEngine } from '../utils/mlEngine';
import { hasPermission, ROLES, logActivity } from '../utils/auth';

const ThreatIntelligence = () => {
  const [threatReport, setThreatReport] = useState(null);
  const [threatAlerts, setThreatAlerts] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [timeframe, setTimeframe] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThreatData();
    const interval = setInterval(loadThreatData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [timeframe]);

  const loadThreatData = () => {
    setIsLoading(true);
    
    // Generate threat report
    const report = mlEngine.generateThreatReport(timeframe);
    setThreatReport(report);
    
    // Get recent alerts
    const alerts = mlEngine.getThreatAlerts(5);
    setThreatAlerts(alerts);
    
    // Get system health
    const health = mlEngine.getSystemHealth();
    setSystemHealth(health);
    
    setIsLoading(false);
    logActivity('THREAT_INTELLIGENCE_VIEWED', { timeframe });
  };

  const simulateThreat = () => {
    const mockThreats = [
      {
        type: 'brute_force',
        timestamp: new Date().toISOString(),
        user: 'unknown',
        ip: '192.168.1.100',
        failedAttempts: 15,
        resourceUsage: 95
      },
      {
        type: 'data_exfiltration',
        timestamp: new Date().toISOString(),
        user: 'suspicious_user',
        dataSize: 250,
        destination: 'external_server',
        resourceUsage: 85
      },
      {
        type: 'agent_compromise',
        timestamp: new Date().toISOString(),
        agentId: 'agent-007',
        heartbeatMissed: 4,
        resourceSpike: 3.2,
        locationChange: 'international'
      }
    ];

    const randomThreat = mockThreats[Math.floor(Math.random() * mockThreats.length)];
    const analysis = mlEngine.analyzeActivity(randomThreat);
    
    alert(`🧠 ML Threat Detection Test\n\nThreat Type: ${randomThreat.type}\nRisk Level: ${analysis.level}\nConfidence: ${analysis.confidence}\nReasons: ${analysis.reasons.join(', ')}`);
    
    logActivity('THREAT_SIMULATION_TEST', { 
      threatType: randomThreat.type, 
      riskLevel: analysis.level,
      confidence: analysis.confidence 
    });
    
    loadThreatData(); // Refresh data
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'degraded': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getThreatColor = (level) => {
    switch (level) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (!hasPermission(ROLES.OPERATOR)) {
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
          Operator privileges required to access threat intelligence.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem', color: 'white' }}>Threat Intelligence Dashboard</h2>
          <p style={{ color: '#ccc', margin: 0 }}>AI-powered threat detection and analysis</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid #444',
              borderRadius: '6px',
              color: 'white'
            }}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button
            onClick={simulateThreat}
            style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            🧪 Test Detection
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
          <p>Loading threat intelligence data...</p>
        </div>
      ) : (
        <>
          {/* System Health Overview */}
          {systemHealth && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #333',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>System Health</h3>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: getHealthColor(systemHealth.status),
                  marginBottom: '0.5rem'
                }}>
                  {systemHealth.status.toUpperCase()}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                  ML Engine Status
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #333',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>24h Threats</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>
                  {systemHealth.threatsLast24h}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                  {systemHealth.criticalThreats} critical
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #333',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>Model Accuracy</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
                  {(systemHealth.modelAccuracy * 100).toFixed(1)}%
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                  Detection confidence
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #333',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>Data Points</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
                  {systemHealth.dataPoints}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                  Training samples
                </div>
              </div>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Threat Alerts */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #333'
            }}>
              <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>🚨 Recent Threat Alerts</h3>
              
              {threatAlerts.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                  <p>No high-priority threats detected</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {threatAlerts.map((alert, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: `2px solid ${getThreatColor(alert.level)}`,
                        borderLeft: `6px solid ${getThreatColor(alert.level)}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ color: 'white', fontWeight: '500', textTransform: 'capitalize' }}>
                          {alert.activity.type} Threat
                        </div>
                        <div style={{ 
                          background: getThreatColor(alert.level),
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: '500'
                        }}>
                          {alert.level.toUpperCase()}
                        </div>
                      </div>
                      <div style={{ color: '#ccc', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                        Confidence: {(alert.confidence * 100).toFixed(1)}%
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Threat Distribution */}
            {threatReport && (
              <div style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #333'
              }}>
                <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>📊 Threat Distribution ({timeframe})</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.entries(threatReport.threatDistribution).map(([level, threats]) => (
                    <div key={level} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: getThreatColor(level)
                        }} />
                        <span style={{ 
                          color: '#ccc', 
                          textTransform: 'capitalize',
                          fontWeight: '500'
                        }}>
                          {level}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'white', fontWeight: '500' }}>{threats.length}</span>
                        <div style={{
                          width: '100px',
                          height: '8px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${(threats.length / threatReport.totalThreats) * 100}%`,
                            height: '100%',
                            background: getThreatColor(level),
                            borderRadius: '4px'
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #333' }}>
                  <h4 style={{ color: '#ccc', marginBottom: '1rem' }}>Activity Breakdown</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Object.entries(threatReport.activityBreakdown).slice(0, 5).map(([type, count]) => (
                      <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#ccc', textTransform: 'capitalize' }}>{type.replace('_', ' ')}</span>
                        <span style={{ color: 'white', fontWeight: '500' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {threatReport && threatReport.recommendations.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #333',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>💡 Security Recommendations</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {threatReport.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${getThreatColor(rec.priority)}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ color: 'white', fontWeight: '500' }}>{rec.action}</div>
                      <div style={{ 
                        background: getThreatColor(rec.priority),
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '500'
                      }}>
                        {rec.priority.toUpperCase()}
                      </div>
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                      {rec.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ML Engine Information */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>🧠 ML Engine Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', color: '#ccc' }}>
              <div>
                <strong>Engine Status:</strong> {mlEngine.isInitialized ? '✅ Active' : '❌ Inactive'}
              </div>
              <div>
                <strong>Training Data:</strong> {mlEngine.trainingData.length} samples
              </div>
              <div>
                <strong>Threat History:</strong> {mlEngine.threatHistory.length} records
              </div>
              <div>
                <strong>Last Updated:</strong> {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThreatIntelligence;

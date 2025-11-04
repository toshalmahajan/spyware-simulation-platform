import React, { useState, useEffect } from 'react';
import { hasPermission, ROLES, logActivity } from '../utils/auth';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    responseTime: 0,
    activeUsers: 0,
    throughput: 0,
    errorRate: 0
  });
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics();
    return () => clearInterval(interval);
  }, []);

  const updateMetrics = () => {
    // Simulate real performance metrics
    const newMetrics = {
      cpu: Math.min(100, Math.max(0, metrics.cpu + (Math.random() - 0.5) * 20)),
      memory: Math.min(100, Math.max(0, metrics.memory + (Math.random() - 0.3) * 10)),
      responseTime: Math.max(10, metrics.responseTime + (Math.random() - 0.5) * 5),
      activeUsers: Math.max(1, Math.round(metrics.activeUsers + (Math.random() - 0.5) * 3)),
      throughput: Math.max(0, metrics.throughput + (Math.random() - 0.4) * 50),
      errorRate: Math.min(5, Math.max(0, metrics.errorRate + (Math.random() - 0.8) * 2))
    };

    setMetrics(newMetrics);
    
    // Add to history
    const timestamp = new Date().toISOString();
    setPerformanceHistory(prev => [...prev.slice(-59), { timestamp, ...newMetrics }]);

    // Check for alerts
    checkAlerts(newMetrics, timestamp);
  };

  const checkAlerts = (currentMetrics, timestamp) => {
    const newAlerts = [];

    if (currentMetrics.cpu > 85) {
      newAlerts.push({
        id: `alert_${timestamp}`,
        type: 'high_cpu',
        severity: 'high',
        message: `High CPU usage: ${currentMetrics.cpu.toFixed(1)}%`,
        timestamp,
        metric: 'cpu',
        value: currentMetrics.cpu
      });
    }

    if (currentMetrics.memory > 90) {
      newAlerts.push({
        id: `alert_${timestamp}`,
        type: 'high_memory',
        severity: 'critical',
        message: `High memory usage: ${currentMetrics.memory.toFixed(1)}%`,
        timestamp,
        metric: 'memory',
        value: currentMetrics.memory
      });
    }

    if (currentMetrics.responseTime > 1000) {
      newAlerts.push({
        id: `alert_${timestamp}`,
        type: 'high_latency',
        severity: 'medium',
        message: `High response time: ${currentMetrics.responseTime.toFixed(0)}ms`,
        timestamp,
        metric: 'responseTime',
        value: currentMetrics.responseTime
      });
    }

    if (currentMetrics.errorRate > 2) {
      newAlerts.push({
        id: `alert_${timestamp}`,
        type: 'high_errors',
        severity: 'high',
        message: `High error rate: ${currentMetrics.errorRate.toFixed(1)}%`,
        timestamp,
        metric: 'errorRate',
        value: currentMetrics.errorRate
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 20));
      newAlerts.forEach(alert => {
        logActivity('PERFORMANCE_ALERT', alert);
      });
    }
  };

  const getMetricColor = (value, thresholds) => {
    if (value >= thresholds.critical) return '#ef4444';
    if (value >= thresholds.warning) return '#f59e0b';
    return '#10b981';
  };

  const metricConfig = {
    cpu: { label: 'CPU Usage', unit: '%', thresholds: { critical: 85, warning: 70 } },
    memory: { label: 'Memory Usage', unit: '%', thresholds: { critical: 90, warning: 75 } },
    responseTime: { label: 'Response Time', unit: 'ms', thresholds: { critical: 1000, warning: 500 } },
    activeUsers: { label: 'Active Users', unit: '', thresholds: { critical: 100, warning: 50 } },
    throughput: { label: 'Throughput', unit: 'req/s', thresholds: { critical: 1000, warning: 500 } },
    errorRate: { label: 'Error Rate', unit: '%', thresholds: { critical: 2, warning: 1 } }
  };

  const clearAlerts = () => {
    setAlerts([]);
    logActivity('PERFORMANCE_ALERTS_CLEARED');
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
          Operator privileges required to access performance monitoring.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: 'white' }}>Performance Monitoring</h2>
      <p style={{ color: '#ccc', marginBottom: '2rem' }}>
        Real-time system performance metrics and health monitoring
      </p>

      {/* Current Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {Object.entries(metrics).map(([key, value]) => {
          const config = metricConfig[key];
          const color = getMetricColor(value, config.thresholds);
          
          return (
            <div
              key={key}
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: `1px solid ${color}20`,
                borderLeft: `4px solid ${color}`
              }}
            >
              <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>
                {config.label}
              </h3>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: color,
                marginBottom: '0.5rem'
              }}>
                {value.toFixed(key === 'responseTime' ? 0 : 1)}{config.unit}
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: value >= config.thresholds.critical ? '#ef4444' : 
                       value >= config.thresholds.warning ? '#f59e0b' : '#10b981'
              }}>
                {value >= config.thresholds.critical ? 'Critical' :
                 value >= config.thresholds.warning ? 'Warning' : 'Normal'}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Performance Alerts */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', margin: 0 }}>🚨 Performance Alerts</h3>
            {alerts.length > 0 && (
              <button
                onClick={clearAlerts}
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
                Clear All
              </button>
            )}
          </div>

          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <p>No performance alerts</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflow: 'auto' }}>
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: `1px solid ${
                      alert.severity === 'critical' ? '#ef4444' :
                      alert.severity === 'high' ? '#f59e0b' : '#3b82f6'
                    }`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ color: 'white', fontWeight: '500' }}>{alert.message}</div>
                    <div style={{ 
                      background: alert.severity === 'critical' ? '#ef4444' :
                                 alert.severity === 'high' ? '#f59e0b' : '#3b82f6',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '500',
                      textTransform: 'uppercase'
                    }}>
                      {alert.severity}
                    </div>
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Trends */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>📈 Performance Trends</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['cpu', 'memory', 'responseTime'].map(metric => {
              const config = metricConfig[metric];
              const recentData = performanceHistory.slice(-10);
              
              return (
                <div key={metric} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{config.label}</span>
                    <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                      Current: {metrics[metric].toFixed(1)}{config.unit}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '2px',
                    height: '40px'
                  }}>
                    {recentData.map((data, index) => {
                      const value = data[metric];
                      const height = Math.max(5, (value / (metric === 'responseTime' ? 2000 : 100)) * 40);
                      const color = getMetricColor(value, config.thresholds);
                      
                      return (
                        <div
                          key={index}
                          style={{
                            width: '100%',
                            height: `${height}px`,
                            background: color,
                            borderRadius: '2px 2px 0 0',
                            opacity: 0.7 + (index / recentData.length) * 0.3
                          }}
                          title={`${value.toFixed(1)}${config.unit}`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #333' }}>
            <h4 style={{ color: '#ccc', marginBottom: '1rem' }}>System Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', color: '#9ca3af', fontSize: '0.8rem' }}>
              <div>
                <strong>Uptime:</strong> 12 days, 4 hours
              </div>
              <div>
                <strong>Version:</strong> 1.0.0
              </div>
              <div>
                <strong>Last Backup:</strong> 2 hours ago
              </div>
              <div>
                <strong>Active Sessions:</strong> {metrics.activeUsers}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Recommendations */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #333',
        marginTop: '2rem'
      }}>
        <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>💡 Performance Recommendations</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {metrics.cpu > 70 && (
            <div style={{
              padding: '1rem',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid #f59e0b',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#f59e0b', fontWeight: '500', marginBottom: '0.5rem' }}>
                ⚡ Optimize CPU Usage
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                Consider scaling horizontally or optimizing resource-intensive operations
              </div>
            </div>
          )}

          {metrics.memory > 75 && (
            <div style={{
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#ef4444', fontWeight: '500', marginBottom: '0.5rem' }}>
                🗃️ Memory Management
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                Review memory usage and consider implementing caching strategies
              </div>
            </div>
          )}

          {metrics.responseTime > 500 && (
            <div style={{
              padding: '1rem',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid #3b82f6',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#3b82f6', fontWeight: '500', marginBottom: '0.5rem' }}>
                🚀 Response Time Optimization
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                Investigate database queries and API response times
              </div>
            </div>
          )}

          {metrics.errorRate > 1 && (
            <div style={{
              padding: '1rem',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid #8b5cf6',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#8b5cf6', fontWeight: '500', marginBottom: '0.5rem' }}>
                🐛 Error Rate Analysis
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                Review error logs and implement better error handling
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;

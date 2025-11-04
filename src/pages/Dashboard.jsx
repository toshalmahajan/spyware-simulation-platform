import React from 'react';

const Dashboard = () => {
  const simulations = [
    { id: 1, name: 'Keyboard Test #1', type: 'Keying™', status: 'running' },
    { id: 2, name: 'Network Analysis', type: 'Source code', status: 'completed' },
    { id: 3, name: 'File Monitor', type: 'Id: monitoring', status: 'pending' }
  ];

  const systemHealth = [
    { name: 'mailing', value: 85 },
    { name: 'completed', value: 92 },
    { name: 'pending', value: 45 },
    { name: 'mailing', value: 78 }
  ];

  const backendServices = [
    { name: 'Database', status: 'operational' },
    { name: 'Agent Communication', status: 'operational' },
    { name: 'Security Scanner', status: 'operational' }
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem', color: 'white' }}>Security Operations Center</h1>
      <p style={{ color: '#ccc', marginBottom: '2rem' }}>Real-time monitoring and threat detection dashboard</p>

      {/* Main Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* User Standards */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>User Standards</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>12</div>
          <div style={{ color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>↗</span>
            +125 from last week
          </div>
        </div>

        {/* Access Standards */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>Access Standards</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>3</div>
          <div style={{ color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠</span>
            Running over
          </div>
        </div>

        {/* Online Agent */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>Online Agent</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>2</div>
          <div style={{ color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>↗</span>
            +4 vtxd
          </div>
        </div>

        {/* Screen Bar */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>Screen Bar</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>87%</div>
          <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Standardize completion</div>
        </div>
      </div>

      {/* Middle Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Recent Simulations */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '600' }}>Recent Simulations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {simulations.map(sim => (
              <div key={sim.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease'
              }}>
                <div>
                  <div style={{ color: 'white', fontWeight: '500', marginBottom: '0.25rem' }}>{sim.name}</div>
                  <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{sim.type}</div>
                </div>
                <span style={{
                  color: sim.status === 'running' ? '#10b981' : 
                         sim.status === 'completed' ? '#3b82f6' : '#f59e0b',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  padding: '0.25rem 0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px'
                }}>
                  {sim.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '600' }}>System Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {systemHealth.map((item, index) => (
              <div key={index}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ 
                    color: '#ccc', 
                    textTransform: 'capitalize',
                    fontSize: '0.9rem'
                  }}>
                    {item.name}
                  </span>
                  <span style={{ 
                    color: 'white', 
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}>
                    {item.value}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${item.value}%`,
                    height: '100%',
                    background: item.value > 80 ? '#10b981' : 
                               item.value > 60 ? '#3b82f6' : 
                               item.value > 40 ? '#f59e0b' : '#ef4444',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
      }}>
        {/* Backend API Status */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '600' }}>Backend API Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {backendServices.map((service, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981'
                  }} />
                  <span style={{ color: 'white', fontWeight: '500' }}>{service.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#10b981', fontSize: '0.8rem' }}>{service.status}</span>
                  <button style={{
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ccc',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.7rem'
                  }}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '600' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              New Standards
            </button>
            
            <button style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🚀</span>
              Deploy Agent
            </button>
            
            <button style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '1.2rem' }}>📊</span>
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

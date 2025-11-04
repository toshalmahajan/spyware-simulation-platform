import React, { useState } from 'react';

const Simulations = () => {
  const [simulations] = useState([
    { id: 1, name: 'Keyboard Test #1', type: 'Keylogger', status: 'running' },
    { id: 2, name: 'Network Analysis', type: 'Network Scan', status: 'completed' },
    { id: 3, name: 'File Monitor', type: 'File Tracking', status: 'pending' },
    { id: 4, name: 'ID Monitoring', type: 'Identity Scan', status: 'running' }
  ]);

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: 'white' }}>Simulations Management</h2>
      <p style={{ color: '#ccc', marginBottom: '2rem' }}>Create and manage security simulations</p>

      {/* Main Dashboard Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* User Standards */}
        <div style={{
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>User Standards</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>12</div>
          <div style={{ color: '#0f0', fontSize: '0.8rem' }}>+125 from last week</div>
        </div>

        {/* Access Standards */}
        <div style={{
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>Access Standards</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>3</div>
          <div style={{ color: '#f00', fontSize: '0.8rem' }}>Running over</div>
        </div>

        {/* Online Agent */}
        <div style={{
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>Online Agent</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>2</div>
          <div style={{ color: '#0f0', fontSize: '0.8rem' }}>+4 vtxd</div>
        </div>

        {/* Screen Bar */}
        <div style={{
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>Screen Bar</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>87%</div>
          <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Standardize completion</div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
      }}>
        {/* Recent Simulations */}
        <div style={{
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Recent Simulations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {simulations.map(sim => (
              <div key={sim.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: '#2d2d2d',
                borderRadius: '4px'
              }}>
                <div>
                  <div style={{ color: 'white', fontWeight: '500' }}>{sim.name}</div>
                  <div style={{ color: '#999', fontSize: '0.8rem' }}>{sim.type}</div>
                </div>
                <span style={{
                  color: sim.status === 'running' ? '#0f0' : sim.status === 'completed' ? '#007acc' : '#ff0',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {sim.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div style={{
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>System Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['running', 'completed', 'pending', 'mailing'].map((status, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#ccc', textTransform: 'capitalize' }}>{status}</span>
                <div style={{
                  width: '100px',
                  height: '6px',
                  background: '#333',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.random() * 100}%`,
                    height: '100%',
                    background: status === 'running' ? '#0f0' : 
                               status === 'completed' ? '#007acc' : 
                               status === 'pending' ? '#ff0' : '#f0f'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        marginTop: '2rem',
        background: '#1a1a1a',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #333'
      }}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{
            padding: '0.75rem 1.5rem',
            background: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            New Standards
          </button>
          <button style={{
            padding: '0.75rem 1.5rem',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Deploy Agent
          </button>
          <button style={{
            padding: '0.75rem 1.5rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Simulations;

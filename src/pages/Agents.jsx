import React, { useState } from 'react';

const Agents = () => {
  const [agents] = useState([
    { id: 1, name: 'Agent-001', status: 'online', location: 'New York', threats: 12 },
    { id: 2, name: 'Agent-002', status: 'offline', location: 'London', threats: 8 },
    { id: 3, name: 'Agent-003', status: 'online', location: 'Tokyo', threats: 3 },
    { id: 4, name: 'Agent-004', status: 'warning', location: 'Berlin', threats: 25 }
  ]);

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: 'white' }}>Agent Monitoring</h2>
      <p style={{ color: '#ccc', marginBottom: '2rem' }}>Monitor and manage deployed agents</p>

      {/* Agent Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>Total Agents</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>4</div>
          <div style={{ color: '#0f0', fontSize: '0.8rem' }}>2 online, 1 warning</div>
        </div>

        <div style={{
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>Active Threats</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f00' }}>48</div>
          <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Across all agents</div>
        </div>

        <div style={{
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>Uptime</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>99.8%</div>
          <div style={{ color: '#0f0', fontSize: '0.8rem' }}>System stability</div>
        </div>
      </div>

      {/* Agents List */}
      <div style={{
        background: '#1a1a1a',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #333',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Deployed Agents</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {agents.map(agent => (
            <div key={agent.id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
              gap: '1rem',
              alignItems: 'center',
              padding: '1rem',
              background: '#2d2d2d',
              borderRadius: '4px'
            }}>
              <div>
                <div style={{ color: 'white', fontWeight: '500' }}>{agent.name}</div>
                <div style={{ color: '#999', fontSize: '0.8rem' }}>{agent.location}</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: agent.status === 'online' ? '#0f0' : 
                             agent.status === 'offline' ? '#f00' : '#ff0'
                }} />
                <span style={{ 
                  color: agent.status === 'online' ? '#0f0' : 
                         agent.status === 'offline' ? '#f00' : '#ff0',
                  textTransform: 'capitalize'
                }}>
                  {agent.status}
                </span>
              </div>
              
              <div>
                <div style={{ color: 'white', fontWeight: '500' }}>{agent.threats}</div>
                <div style={{ color: '#999', fontSize: '0.8rem' }}>threats</div>
              </div>
              
              <div>
                <div style={{ color: '#0f0', fontWeight: '500' }}>Active</div>
                <div style={{ color: '#999', fontSize: '0.8rem' }}>monitoring</div>
              </div>
              
              <button style={{
                padding: '0.5rem 1rem',
                background: '#007acc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}>
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Backend API Status */}
      <div style={{
        background: '#1a1a1a',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #333'
      }}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Backend API Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {['Database', 'Agent Communication', 'Security Scanner'].map((service, index) => (
            <div key={index} style={{
              padding: '1rem',
              background: '#2d2d2d',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <div style={{ color: 'white', fontWeight: '500', marginBottom: '0.5rem' }}>{service}</div>
              <div style={{ 
                color: '#0f0', 
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#0f0'
                }} />
                Operational
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agents;

import React, { useState } from 'react';

const Reports = () => {
  const [reports, setReports] = useState([
    { id: 1, name: 'Weekly Security Summary', type: 'Summary', date: '2024-11-04', status: 'completed', size: '2.4 MB' },
    { id: 2, name: 'Threat Analysis Report', type: 'Analysis', date: '2024-11-03', status: 'completed', size: '1.8 MB' },
    { id: 3, name: 'Network Traffic Report', type: 'Network', date: '2024-11-04', status: 'generating', size: 'Processing...' },
    { id: 4, name: 'Compliance Audit', type: 'Audit', date: '2024-11-02', status: 'completed', size: '3.1 MB' }
  ]);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newReport, setNewReport] = useState({
    name: '',
    type: 'summary',
    timeframe: '7d',
    includeCharts: true,
    includeThreats: true,
    includeAgents: true
  });

  const reportTypes = [
    { value: 'summary', label: 'Security Summary', description: 'Comprehensive security overview' },
    { value: 'threat', label: 'Threat Analysis', description: 'Detailed threat intelligence' },
    { value: 'network', label: 'Network Scan', description: 'Network traffic and patterns' },
    { value: 'compliance', label: 'Compliance Audit', description: 'Regulatory compliance status' },
    { value: 'agent', label: 'Agent Status', description: 'Agent performance and health' },
    { value: 'simulation', label: 'Simulation Results', description: 'Security test outcomes' }
  ];

  const timeframes = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const generateReport = (e) => {
    e.preventDefault();
    
    // Generate a unique ID
    const newId = Math.max(...reports.map(r => r.id), 0) + 1;
    
    // Create the new report
    const generatedReport = {
      id: newId,
      name: newReport.name || `${reportTypes.find(t => t.value === newReport.type)?.label} - ${new Date().toLocaleDateString()}`,
      type: reportTypes.find(t => t.value === newReport.type)?.label,
      date: new Date().toISOString().split('T')[0],
      status: 'generating',
      size: 'Processing...'
    };

    // Add to reports list
    setReports([generatedReport, ...reports]);
    setShowGenerateModal(false);
    
    // Reset form
    setNewReport({
      name: '',
      type: 'summary',
      timeframe: '7d',
      includeCharts: true,
      includeThreats: true,
      includeAgents: true
    });

    // Simulate report generation process
    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.id === generatedReport.id 
          ? { ...r, status: 'completed', size: `${(Math.random() * 2 + 1).toFixed(1)} MB` }
          : r
      ));
      
      // Show success notification
      alert(`✅ Report "${generatedReport.name}" generated successfully!`);
    }, 3000);

    // Show generating notification
    alert(`🔄 Generating report "${generatedReport.name}"... This may take a few seconds.`);
  };

  const downloadReport = (report) => {
    if (report.status === 'completed') {
      // Simulate download
      alert(`📥 Downloading: ${report.name}\nFile size: ${report.size}`);
      
      // In a real app, this would trigger actual file download
      console.log(`Initiating download for report: ${report.name}`);
    } else {
      alert('⏳ Report is still being generated. Please wait...');
    }
  };

  const viewReport = (report) => {
    if (report.status === 'completed') {
      alert(`👁️ Opening: ${report.name}\n\nThis would open the report in a new viewer with:\n• Security metrics\n• Threat analysis\n• Agent status\n• Recommendations`);
    } else {
      alert('⏳ Report is still being generated. Please wait...');
    }
  };

  const deleteReport = (reportId) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      setReports(reports.filter(r => r.id !== reportId));
      alert('🗑️ Report deleted successfully!');
    }
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? '#10b981' : 
           status === 'generating' ? '#f59e0b' : '#6b7280';
  };

  const getStatusIcon = (status) => {
    return status === 'completed' ? '✅' :
           status === 'generating' ? '🔄' : '❓';
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: 'white' }}>Security Reports</h2>
      <p style={{ color: '#ccc', marginBottom: '2rem' }}>View and generate security reports</p>

      {/* Report Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>Total Reports</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
            {reports.length}
          </div>
          <div style={{ color: '#10b981', fontSize: '0.8rem' }}>+{Math.floor(reports.length * 0.2)} this week</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>Completed</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
            {reports.filter(r => r.status === 'completed').length}
          </div>
          <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Ready for review</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>In Progress</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem' }}>
            {reports.filter(r => r.status === 'generating').length}
          </div>
          <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Generating reports</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>Total Data</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
            {reports.filter(r => r.status === 'completed').reduce((total, r) => {
              const size = parseFloat(r.size);
              return total + (isNaN(size) ? 0 : size);
            }, 0).toFixed(1)} MB
          </div>
          <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Report storage</div>
        </div>
      </div>

      {/* Reports List */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #333',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'white', margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Recent Reports</h3>
          <button 
            onClick={() => setShowGenerateModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span>📊</span>
            Generate New Report
          </button>
        </div>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {reports.map(report => (
            <div key={report.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
              gap: '1rem',
              alignItems: 'center',
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease'
            }}>
              <div>
                <div style={{ color: 'white', fontWeight: '500', marginBottom: '0.25rem' }}>{report.name}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Created: {report.date}</div>
              </div>
              
              <div>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  color: '#ccc',
                  fontWeight: '500'
                }}>
                  {report.type}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{getStatusIcon(report.status)}</span>
                <span style={{
                  color: getStatusColor(report.status),
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  fontSize: '0.9rem'
                }}>
                  {report.status}
                </span>
              </div>
              
              <div style={{ color: '#ccc', fontSize: '0.9rem', fontWeight: '500' }}>
                {report.size}
              </div>
              
              <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                {report.status === 'completed' ? 'Ready' : 'Processing...'}
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => viewReport(report)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    border: '1px solid #3b82f6',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  👁️ View
                </button>
                <button 
                  onClick={() => downloadReport(report)}
                  disabled={report.status !== 'completed'}
                  style={{
                    padding: '0.5rem 1rem',
                    background: report.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                    color: report.status === 'completed' ? '#10b981' : '#6b7280',
                    border: report.status === 'completed' ? '1px solid #10b981' : '1px solid #6b7280',
                    borderRadius: '6px',
                    cursor: report.status === 'completed' ? 'pointer' : 'not-allowed',
                    fontSize: '0.8rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  📥 Download
                </button>
                <button 
                  onClick={() => deleteReport(report.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #333',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'white', margin: 0, fontSize: '1.3rem' }}>Generate New Report</h3>
              <button 
                onClick={() => setShowGenerateModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={generateReport}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontWeight: '500' }}>
                  Report Name
                </label>
                <input
                  type="text"
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  placeholder="Enter report name..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontWeight: '500' }}>
                  Report Type
                </label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontWeight: '500' }}>
                  Timeframe
                </label>
                <select
                  value={newReport.timeframe}
                  onChange={(e) => setNewReport({ ...newReport, timeframe: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  {timeframes.map(timeframe => (
                    <option key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', color: '#ccc', fontWeight: '500' }}>
                  Include Sections
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {['includeCharts', 'includeThreats', 'includeAgents'].map((field, index) => (
                    <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ccc' }}>
                      <input
                        type="checkbox"
                        checked={newReport[field]}
                        onChange={(e) => setNewReport({ ...newReport, [field]: e.target.checked })}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      {field === 'includeCharts' && '📊 Charts & Graphs'}
                      {field === 'includeThreats' && '🚨 Threat Analysis'}
                      {field === 'includeAgents' && '🖥️ Agent Status'}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ccc',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  🚀 Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #333',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600' }}>Quick Report Templates</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <button 
            onClick={() => {
              setNewReport({
                name: 'Daily Security Briefing',
                type: 'summary',
                timeframe: '1d',
                includeCharts: true,
                includeThreats: true,
                includeAgents: true
              });
              setShowGenerateModal(true);
            }}
            style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>📋</span>
            <div>Daily Briefing</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>24-hour overview</div>
          </button>

          <button 
            onClick={() => {
              setNewReport({
                name: 'Weekly Threat Report',
                type: 'threat',
                timeframe: '7d',
                includeCharts: true,
                includeThreats: true,
                includeAgents: false
              });
              setShowGenerateModal(true);
            }}
            style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🚨</span>
            <div>Threat Report</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Weekly analysis</div>
          </button>

          <button 
            onClick={() => {
              setNewReport({
                name: 'Monthly Compliance',
                type: 'compliance',
                timeframe: '30d',
                includeCharts: true,
                includeThreats: false,
                includeAgents: true
              });
              setShowGenerateModal(true);
            }}
            style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>📊</span>
            <div>Compliance</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Monthly audit</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;

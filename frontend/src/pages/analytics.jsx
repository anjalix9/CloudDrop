import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../api/api';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      nav('/login');
      return;
    }
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav]);

  const loadAnalytics = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await getAnalytics();
      setAnalytics(res.data);
    } catch (e) {
      if (e?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        nav('/login');
      } else {
        setError(e?.response?.data?.message || e.message || 'Failed to load analytics');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="card">
        <h2>Analytics Dashboard</h2>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2>Analytics Dashboard</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="card">
        <h2>Analytics Dashboard</h2>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const uploadHistoryData = analytics.uploadHistory || [];
  const recentUploads = analytics.recentUploads || [];

  // Storage usage data for pie chart (if we want to show breakdown)
  const storagePercentage = analytics.totalStorage > 0 
    ? Math.min(100, (analytics.totalStorage / (1024 * 1024 * 1024)) * 100) // Assuming 1GB limit for visualization
    : 0;

  return (
    <div className="media-library-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Analytics Dashboard</h1>
        </div>
      </div>
      
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '20px',
          marginTop: '20px'
        }}>
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-value">{analytics.fileCount || 0}</div>
            <div className="stat-label">Total Files</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💾</div>
            <div className="stat-value">{formatBytes(analytics.totalStorage || 0)}</div>
            <div className="stat-label">Storage Used</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{uploadHistoryData.length}</div>
            <div className="stat-label">Active Days</div>
          </div>
        </div>

        {/* Storage Usage Progress Bar */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: 'var(--accent-blue)', marginBottom: '15px', fontSize: '1.2em' }}>Storage Usage</h3>
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.05)', 
            borderRadius: '10px', 
            padding: '3px',
            position: 'relative'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #2271b1, #2271b1)',
              height: '30px',
              borderRadius: '8px',
              width: `${Math.min(100, storagePercentage)}%`,
              transition: 'width 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.9em'
            }}>
              {formatBytes(analytics.totalStorage || 0)}
            </div>
          </div>
          <p style={{ marginTop: '8px', fontSize: '0.9em', color: '#666' }}>
            {formatBytes(analytics.totalStorage || 0)} of storage used
          </p>
        </div>

      {/* Upload History Chart */}
      {uploadHistoryData.length > 0 && (
        <div className="card" style={{ maxWidth: '100%', marginBottom: '20px', marginTop: '20px' }}>
          <h3 style={{ color: 'var(--accent-blue)', marginBottom: '20px', fontSize: '1.3em' }}>
            Upload History
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={uploadHistoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#666"
              />
              <YAxis stroke="#666" />
              <Tooltip 
                labelFormatter={(value) => formatDate(value)}
                formatter={(value) => [`${value} file${value !== 1 ? 's' : ''}`, 'Uploads']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
                name="Files Uploaded"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bar Chart Alternative */}
      {uploadHistoryData.length > 0 && (
        <div className="card" style={{ maxWidth: '100%', marginBottom: '20px' }}>
          <h3 style={{ color: 'var(--accent-blue)', marginBottom: '20px', fontSize: '1.3em' }}>
            Upload Activity by Date
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={uploadHistoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#666"
              />
              <YAxis stroke="#666" />
              <Tooltip 
                labelFormatter={(value) => formatDate(value)}
                formatter={(value) => [`${value} file${value !== 1 ? 's' : ''}`, 'Uploads']}
              />
              <Legend />
              <Bar 
                dataKey="count" 
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
                name="Files Uploaded"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Uploads */}
      {recentUploads.length > 0 && (
        <div className="card" style={{ maxWidth: '100%', marginTop: '20px' }}>
          <h3 style={{ color: 'var(--accent-blue)', marginBottom: '20px', fontSize: '1.3em' }}>
            Recent Uploads (Last 30 Days)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>File Name</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#666' }}>Size</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentUploads.map((file) => (
                  <tr key={file.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{file.name}</td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#666' }}>
                      {formatBytes(file.size || 0)}
                    </td>
                    <td style={{ padding: '12px', color: '#666' }}>
                      {formatDate(file.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {uploadHistoryData.length === 0 && recentUploads.length === 0 && (
        <div className="card" style={{ maxWidth: '100%', textAlign: 'center', marginTop: '20px' }}>
          <div style={{ fontSize: '3em', marginBottom: '20px' }}>📊</div>
          <p style={{ fontSize: '1.1em', color: '#666' }}>
            No upload history yet. Start uploading files to see your analytics!
          </p>
        </div>
      )}
    </div>
  );
}


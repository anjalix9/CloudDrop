import React, { useEffect, useMemo, useState } from 'react';
import { getStats } from '../api/api';

export default function Analytics() {
  const [stats, setStats] = useState({ totalFiles: 0, totalBytes: 0, daily: [] });
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      setErr('');
      try {
        const res = await getStats();
        setStats(res.data);
      } catch (e) {
        setErr(e?.response?.data?.message || e.message);
      }
    })();
  }, []);

  const { maxCount, maxBytes } = useMemo(() => {
    let mc = 0, mb = 0;
    for (const d of stats.daily) {
      mc = Math.max(mc, d.count);
      mb = Math.max(mb, d.bytes);
    }
    return { maxCount: mc || 1, maxBytes: mb || 1 };
  }, [stats.daily]);

  const formatBytes = (n) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024*1024) return `${(n/1024).toFixed(1)} KB`;
    if (n < 1024*1024*1024) return `${(n/1024/1024).toFixed(1)} MB`;
    return `${(n/1024/1024/1024).toFixed(2)} GB`;
  };

  return (
    <div className="card">
      <h2>Analytics</h2>
      {err && <div className="error">{err}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 12 }}>
        <div className="card" style={{ background: '#f8fafc' }}>
          <div style={{ fontSize: 12, color: '#475569' }}>Total Files</div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{stats.totalFiles}</div>
        </div>
        <div className="card" style={{ background: '#f8fafc' }}>
          <div style={{ fontSize: 12, color: '#475569' }}>Storage Used</div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{formatBytes(stats.totalBytes)}</div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Uploads (last 30 days)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          {/* Count Bar Chart */}
          <div>
            <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>By Count</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 140, borderBottom: '1px solid #e2e8f0', paddingBottom: 6, overflowX: 'auto' }}>
              {stats.daily.map(d => (
                <div key={d._id} title={`${d._id}: ${d.count}`} style={{ width: 16, background: '#6366f1', height: `${(d.count/maxCount)*100}%` }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: 10, color: '#64748b', marginTop: 6, overflowX: 'auto' }}>
              {stats.daily.map(d => (
                <div key={d._id} style={{ minWidth: 32, textAlign: 'center' }}>{d._id.slice(5)}</div>
              ))}
            </div>
          </div>

          {/* Size Bar Chart */}
          <div>
            <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>By Size</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 140, borderBottom: '1px solid #e2e8f0', paddingBottom: 6, overflowX: 'auto' }}>
              {stats.daily.map(d => (
                <div key={d._id} title={`${d._id}: ${formatBytes(d.bytes)}`} style={{ width: 16, background: '#22c55e', height: `${(d.bytes/maxBytes)*100}%` }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: 10, color: '#64748b', marginTop: 6, overflowX: 'auto' }}>
              {stats.daily.map(d => (
                <div key={d._id} style={{ minWidth: 32, textAlign: 'center' }}>{d._id.slice(5)}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



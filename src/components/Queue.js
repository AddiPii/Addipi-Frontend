import { React, useState, useEffect } from "react";


export default function Queue(){
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ lastFetch, setLastFetch ] = useState(null);

    const apiBase = process.env.QUEUE_SERVICE_API_URL || 'http://localhost:4000';

    const fetchQueue = async() => {
        setLoading(true);
        setError(null);
        try{
            const response = await fetch(`${apiBase}/queue`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const json = await response.json();
            setData(json);
            setLastFetch(new Date().toISOString());
        } catch (e){
            setError(e.message || String(e));
            setData(null);
        } finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    return(
        <div style={{ padding: 12 }}>
      <h3>Queue</h3>
      <div style={{ marginBottom: 8 }}>
        <button onClick={fetchQueue} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
        {lastFetch && <span style={{ marginLeft: 8, color: '#666' }}>Last: {lastFetch}</span>}
      </div>

      {error && (
        <div style={{ color: 'red' }}>Error: {error}</div>
      )}

      {!error && data && (
        <div>
          <div style={{ marginBottom: 8 }}>
            <strong>Service Bus connected:</strong> {String(data.serviceBus?.connected)}
            <br />
            <strong>Receiver:</strong> {data.receiver || '—'}
          </div>

          <div>
            <strong>Recent Jobs ({(data.recentJobs || []).length}):</strong>
            {(data.recentJobs && data.recentJobs.length > 0) ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>id</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>fileId</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>status</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>scheduledAt</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>createdAt</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentJobs.map((j) => (
                    <tr key={j.id || j._rid || JSON.stringify(j)}>
                      <td style={{ padding: '6px 4px', borderBottom: '1px solid #f2f2f2' }}>{j.id || j.jobId || '—'}</td>
                      <td style={{ padding: '6px 4px', borderBottom: '1px solid #f2f2f2' }}>{j.fileId || '—'}</td>
                      <td style={{ padding: '6px 4px', borderBottom: '1px solid #f2f2f2' }}>{j.status || '—'}</td>
                      <td style={{ padding: '6px 4px', borderBottom: '1px solid #f2f2f2' }}>{j.scheduledAt || '—'}</td>
                      <td style={{ padding: '6px 4px', borderBottom: '1px solid #f2f2f2' }}>{j.createdAt || j._ts ? (j.createdAt || new Date((j._ts||0)*1000).toISOString()) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: '#666', marginTop: 6 }}>No recent jobs</div>
            )}
          </div>
        </div>
      )}
    </div>
    );
}
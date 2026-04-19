import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ManageListings = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [togglingId, setTogglingId] = useState(null);

    const fetchJobs = async () => {
        setLoading(true);
        try { const res = await api.get('/admin/jobs'); setJobs(res.data); }
        catch { setMessage({ type: 'danger', text: 'Failed to load job listings.' }); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchJobs(); }, []);

    const toggleStatus = async (id, current) => {
        const newStatus = current === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
        setTogglingId(id);
        try {
            await api.put(`/admin/jobs/${id}/status?status=${newStatus}`);
            setMessage({ type: 'success', text: `Listing ${newStatus === 'ACTIVE' ? 'reopened' : 'closed'}.` });
            fetchJobs();
        } catch { setMessage({ type: 'danger', text: 'Failed to update listing status.' }); }
        finally { setTogglingId(null); }
    };

    if (loading) return <div style={{ textAlign: 'center', paddingTop: '80px' }}><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Manage All Listings</h2>
                <p style={{ color: '#64748b', marginBottom: 0 }}>Review and moderate all job listings posted on the platform.</p>
            </div>

            {message.text && (
                <div style={{ background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`, borderRadius: '10px', padding: '11px 16px', marginBottom: '16px', color: message.type === 'success' ? '#15803d' : '#b91c1c', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{message.text}</span><button onClick={() => setMessage({ type: '', text: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>&#x2715;</button>
                </div>
            )}

            {jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '2.5rem', opacity: 0.3, marginBottom: '12px' }}>&#128196;</div>
                    <h4 style={{ color: '#64748b' }}>No listings found</h4>
                </div>
            ) : (
                <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr><th>Title</th><th>Company</th><th>Location</th><th>Type</th><th>Applicants</th><th>Status</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                {jobs.map(job => (
                                    <tr key={job.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{job.title}</td>
                                        <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{job.companyName}</td>
                                        <td style={{ color: '#64748b', fontSize: '0.83rem' }}>{job.location}</td>
                                        <td>
                                            <span style={{ background: job.type === 'JOB' ? '#eef2ff' : '#ecfeff', color: job.type === 'JOB' ? '#4338ca' : '#0e7490', border: `1px solid ${job.type === 'JOB' ? '#c7d2fe' : '#a5f3fc'}`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700 }}>{job.type}</span>
                                        </td>
                                        <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{job.applicationCount ?? 0}</td>
                                        <td>
                                            <span style={{ background: job.status === 'ACTIVE' ? '#f0fdf4' : '#fef2f2', color: job.status === 'ACTIVE' ? '#16a34a' : '#dc2626', border: `1px solid ${job.status === 'ACTIVE' ? '#bbf7d0' : '#fecaca'}`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700 }}>{job.status}</span>
                                        </td>
                                        <td>
                                            <button onClick={() => toggleStatus(job.id, job.status)} disabled={togglingId === job.id}
                                                style={{ padding: '5px 14px', background: job.status === 'ACTIVE' ? '#fffbeb' : '#f0fdf4', color: job.status === 'ACTIVE' ? '#d97706' : '#16a34a', border: `1px solid ${job.status === 'ACTIVE' ? '#fde68a' : '#bbf7d0'}`, borderRadius: '7px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                                                {togglingId === job.id ? <span className="spinner-border spinner-border-sm" style={{ width: '12px', height: '12px' }}></span> : job.status === 'ACTIVE' ? 'Close' : 'Reopen'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ManageListings;

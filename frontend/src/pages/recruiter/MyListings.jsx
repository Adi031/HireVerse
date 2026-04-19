import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const MyListings = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [togglingId, setTogglingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    const fetchListings = async () => {
        setLoading(true);
        try { const r = await api.get('/jobs/recruiter/my-listings'); setJobs(r.data); }
        catch (err) { setError(err.response?.data || 'Failed to fetch listings.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchListings(); }, []);

    const toggleStatus = async (id, current) => {
        const newStatus = current === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
        setTogglingId(id);
        try { await api.put(`/jobs/${id}/status?status=${newStatus}`); setMsg({ type: 'success', text: `Listing ${newStatus === 'ACTIVE' ? 'reopened' : 'closed'}.` }); fetchListings(); }
        catch (err) { setMsg({ type: 'danger', text: err.response?.data || 'Failed to update status.' }); }
        finally { setTogglingId(null); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Permanently delete this listing? This cannot be undone.')) return;
        setDeletingId(id);
        try { await api.delete(`/jobs/${id}`); setMsg({ type: 'success', text: 'Listing deleted.' }); setJobs(prev => prev.filter(j => j.id !== id)); }
        catch (err) { setMsg({ type: 'danger', text: err.response?.data || 'Failed to delete listing.' }); }
        finally { setDeletingId(null); }
    };

    if (loading) return <div style={{ textAlign: 'center', paddingTop: '80px' }}><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>My Listings</h2>
                    {jobs.length > 0 && <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>{jobs.length} listing{jobs.length !== 1 ? 's' : ''}</p>}
                </div>
                <Link to="/recruiter/post-job" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
                    + Post New Job
                </Link>
            </div>

            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#b91c1c' }}>{typeof error === 'object' ? JSON.stringify(error) : error}</div>}
            {msg.text && (
                <div style={{ background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}`, borderRadius: '10px', padding: '11px 16px', marginBottom: '16px', color: msg.type === 'success' ? '#15803d' : '#b91c1c', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{msg.text}</span><button onClick={() => setMsg({ type: '', text: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>&#x2715;</button>
                </div>
            )}

            {jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '2.5rem', opacity: 0.3, marginBottom: '12px' }}>&#128196;</div>
                    <h4 style={{ color: '#64748b' }}>No listings yet</h4>
                    <p style={{ color: '#94a3b8' }}>Post your first job or internship to get started.</p>
                    <Link to="/recruiter/post-job" className="btn btn-primary btn-sm">Post a Job</Link>
                </div>
            ) : (
                <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Applicants</th>
                                    <th>Posted</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(job => (
                                    <tr key={job.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td>
                                            <p style={{ fontWeight: 700, marginBottom: '2px', color: '#0f172a', fontSize: '0.9rem' }}>{job.title}</p>
                                            <small style={{ color: '#94a3b8' }}>{job.location}</small>
                                        </td>
                                        <td>
                                            <span style={{ background: job.type === 'JOB' ? '#eef2ff' : '#ecfeff', color: job.type === 'JOB' ? '#4338ca' : '#0e7490', border: `1px solid ${job.type === 'JOB' ? '#c7d2fe' : '#a5f3fc'}`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700 }}>{job.type}</span>
                                        </td>
                                        <td>
                                            <Link to={`/recruiter/listings/${job.id}/applicants`} style={{ textDecoration: 'none' }}>
                                                <span style={{ background: '#f1f5f9', color: '#475569', borderRadius: '20px', padding: '4px 10px', fontSize: '0.78rem', fontWeight: 600 }}>{job.applicationCount ?? 0} applicants</span>
                                            </Link>
                                        </td>
                                        <td><small style={{ color: '#64748b' }}>{new Date(job.postedAt).toLocaleDateString('en-IN')}</small></td>
                                        <td>
                                            <span style={{ background: job.status === 'ACTIVE' ? '#f0fdf4' : '#fef2f2', color: job.status === 'ACTIVE' ? '#16a34a' : '#dc2626', border: `1px solid ${job.status === 'ACTIVE' ? '#bbf7d0' : '#fecaca'}`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700 }}>{job.status}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                <button onClick={() => navigate(`/recruiter/edit-job/${job.id}`)} style={{ padding: '5px 12px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                                                <Link to={`/recruiter/listings/${job.id}/applicants`} style={{ padding: '5px 12px', background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', borderRadius: '7px', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>Applicants</Link>
                                                <button onClick={() => toggleStatus(job.id, job.status)} disabled={togglingId === job.id}
                                                    style={{ padding: '5px 12px', background: job.status === 'ACTIVE' ? '#fffbeb' : '#f0fdf4', color: job.status === 'ACTIVE' ? '#d97706' : '#16a34a', border: `1px solid ${job.status === 'ACTIVE' ? '#fde68a' : '#bbf7d0'}`, borderRadius: '7px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                                                    {togglingId === job.id ? <span className="spinner-border spinner-border-sm" style={{ width: '12px', height: '12px' }}></span> : job.status === 'ACTIVE' ? 'Close' : 'Reopen'}
                                                </button>
                                                <button onClick={() => handleDelete(job.id)} disabled={deletingId === job.id}
                                                    style={{ padding: '5px 12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '7px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                                                    {deletingId === job.id ? <span className="spinner-border spinner-border-sm" style={{ width: '12px', height: '12px' }}></span> : 'Delete'}
                                                </button>
                                            </div>
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
export default MyListings;

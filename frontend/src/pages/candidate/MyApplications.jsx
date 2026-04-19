import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const STATUS_CFG = {
    APPLIED:     { color: '#64748b', bg: '#f1f5f9', label: 'Applied' },
    SHORTLISTED: { color: '#0284c7', bg: '#f0f9ff', label: 'Shortlisted' },
    INTERVIEW:   { color: '#d97706', bg: '#fffbeb', label: 'Interview' },
    HIRED:       { color: '#16a34a', bg: '#f0fdf4', label: 'Hired' },
    REJECTED:    { color: '#dc2626', bg: '#fef2f2', label: 'Rejected' },
};

const TIMELINE_STEPS = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED'];

const StatusTimeline = ({ status }) => {
    const isRejected = status === 'REJECTED';
    const activeIdx = isRejected ? 0 : TIMELINE_STEPS.indexOf(status);
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '12px 0', position: 'relative' }}>
            {TIMELINE_STEPS.map((step, i) => {
                const done = !isRejected && i <= activeIdx;
                const rejected = isRejected && i === 0;
                const dotColor = rejected ? '#dc2626' : done ? '#6366f1' : '#e2e8f0';
                const textColor = rejected ? '#dc2626' : done ? '#6366f1' : '#94a3b8';
                return (
                    <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        {i < TIMELINE_STEPS.length - 1 && (
                            <div style={{ position: 'absolute', top: '10px', left: '50%', width: '100%', height: '2px', background: done && !isRejected && i < activeIdx ? '#6366f1' : '#e2e8f0', zIndex: 0 }} />
                        )}
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: dotColor, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {(done || rejected) && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>&#10003;</span>}
                        </div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: textColor, marginTop: '4px', textAlign: 'center', lineHeight: 1.2 }}>
                            {rejected && i === 0 ? 'Rejected' : STATUS_CFG[step]?.label || step}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [withdrawingId, setWithdrawingId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        api.get('/applications/my-applications')
            .then(r => setApplications(r.data.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))))
            .catch(() => setMessage({ type: 'danger', text: 'Failed to load applications.' }))
            .finally(() => setLoading(false));
    }, []);

    const handleWithdraw = async (appId) => {
        if (!window.confirm('Withdraw this application?')) return;
        setWithdrawingId(appId);
        try {
            await api.delete(`/applications/${appId}`);
            setMessage({ type: 'success', text: 'Application withdrawn.' });
            setApplications(prev => prev.filter(a => a.id !== appId));
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data || 'Could not withdraw application.' });
        } finally {
            setWithdrawingId(null);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', paddingTop: '80px' }}><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div>
            <h2 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>My Applications</h2>

            {message.text && (
                <div style={{ background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: message.type === 'success' ? '#15803d' : '#b91c1c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage({ type: '', text: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>&#x2715;</button>
                </div>
            )}

            {applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '2.5rem', opacity: 0.3, marginBottom: '12px' }}>&#128196;</div>
                    <h4 style={{ color: '#64748b' }}>No applications yet</h4>
                    <p style={{ color: '#94a3b8' }}>Start applying to jobs to see them here.</p>
                    <Link to="/jobs" className="btn btn-primary btn-sm">Browse Jobs</Link>
                </div>
            ) : (
                <div className="row">
                    {applications.map(app => {
                        const cfg = STATUS_CFG[app.status] || STATUS_CFG.APPLIED;
                        return (
                            <div className="col-md-6 mb-4" key={app.id}>
                                <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: '14px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                    {/* Header */}
                                    <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                            <h5 style={{ fontWeight: 700, margin: 0, fontSize: '1rem', color: '#0f172a' }}>{app.jobTitle}</h5>
                                            <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700, whiteSpace: 'nowrap', marginLeft: '8px', flexShrink: 0 }}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>{app.companyName}</p>
                                    </div>

                                    {/* Timeline */}
                                    <div style={{ padding: '4px 20px' }}>
                                        <StatusTimeline status={app.status} />
                                        <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '0 0 14px' }}>
                                            Applied {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ padding: '12px 20px 18px', marginTop: 'auto', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px' }}>
                                        <Link to={`/jobs/${app.jobListingId}`} style={{ padding: '7px 16px', background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                                            View Job
                                        </Link>
                                        {app.status === 'APPLIED' && (
                                            <button onClick={() => handleWithdraw(app.id)} disabled={withdrawingId === app.id}
                                                style={{ padding: '7px 16px', background: '#fff', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                                                {withdrawingId === app.id ? <><span className="spinner-border spinner-border-sm me-1" style={{ width: '12px', height: '12px' }}></span>Withdrawing</> : 'Withdraw'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
export default MyApplications;

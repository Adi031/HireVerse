import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const STATUS_CONFIG = {
    APPLIED:     { badge: '#64748b', label: 'Applied' },
    SHORTLISTED: { badge: '#0284c7', label: 'Shortlisted' },
    INTERVIEW:   { badge: '#d97706', label: 'Interview' },
    HIRED:       { badge: '#16a34a', label: 'Hired' },
    REJECTED:    { badge: '#dc2626', label: 'Rejected' },
};
const ALL_STATUSES = ['SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED'];

const AtsGauge = ({ score }) => {
    if (score === null || score === undefined) return null;
    const color = score >= 70 ? '#16a34a' : score >= 40 ? '#d97706' : '#dc2626';
    const label = score >= 70 ? 'Strong Match' : score >= 40 ? 'Partial Match' : 'Low Match';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: '99px', transition: 'width 0.6s ease' }} />
            </div>
            <span style={{
                background: color + '18', color, border: `1px solid ${color}44`,
                borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap'
            }}>
                {score}% — {label}
            </span>
        </div>
    );
};

const ViewApplicants = () => {
    const { id } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [expandedCoverLetter, setExpandedCoverLetter] = useState(null);
    const [sortBy, setSortBy] = useState('date'); // 'date' | 'ats'

    const fetchApplicants = async () => {
        try {
            const response = await api.get(`/applications/job/${id}`);
            setApplicants(response.data.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)));
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data || 'Failed to load applicants.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApplicants(); }, [id]);

    const updateStatus = async (appId, newStatus) => {
        setUpdatingId(appId);
        try {
            await api.put(`/applications/${appId}/status?status=${newStatus}`);
            setMessage({ type: 'success', text: `Status updated to ${newStatus}.` });
            setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data || 'Failed to update status.' });
        } finally {
            setUpdatingId(null);
        }
    };

    const sorted = [...applicants].sort((a, b) => {
        if (sortBy === 'ats') return (b.atsScore ?? -1) - (a.atsScore ?? -1);
        return new Date(b.appliedAt) - new Date(a.appliedAt);
    });

    if (loading) return (
        <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading applicants...</p>
        </div>
    );

    return (
        <div className="mt-4">
            <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                    <h2 className="fw-bold mb-0">Applicants</h2>
                    {applicants.length > 0 && (
                        <p className="text-muted small mb-0 mt-1">
                            {applicants.length} application{applicants.length !== 1 ? 's' : ''} received
                        </p>
                    )}
                </div>
                <Link to="/recruiter/listings" className="btn btn-outline-secondary btn-sm">&#8592; Back to Listings</Link>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible`}>
                    {message.text}
                    <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                </div>
            )}

            {applicants.length === 0 ? (
                <div className="text-center py-5" style={{ background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.4 }}>&#128101;</div>
                    <h4 className="text-muted">No applicants yet</h4>
                    <p className="text-muted small">Share your job listing to start receiving applications.</p>
                </div>
            ) : (
                <>
                    {/* Sort Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Sort by:</span>
                        {[{ key: 'date', label: 'Latest First' }, { key: 'ats', label: 'ATS Score' }].map(opt => (
                            <button key={opt.key} onClick={() => setSortBy(opt.key)}
                                style={{
                                    padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                                    background: sortBy === opt.key ? '#6366f1' : '#f1f5f9',
                                    color: sortBy === opt.key ? '#fff' : '#475569',
                                    border: sortBy === opt.key ? '1px solid #6366f1' : '1px solid #e2e8f0'
                                }}>
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="row">
                        {sorted.map(app => {
                            const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.APPLIED;
                            return (
                                <div className="col-md-6 mb-4" key={app.id}>
                                    <div style={{
                                        background: '#fff', border: '1px solid #e8edf5', borderRadius: '14px',
                                        boxShadow: '0 1px 6px rgba(0,0,0,0.05)', height: '100%',
                                        display: 'flex', flexDirection: 'column', overflow: 'hidden'
                                    }}>
                                        {/* Card header */}
                                        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                                <Link to={`/recruiter/candidate/${app.candidateId}`}
                                                    style={{ fontWeight: 700, fontSize: '1rem', color: '#4338ca', textDecoration: 'none' }}>
                                                    {app.candidateName}
                                                </Link>
                                                <span style={{
                                                    background: cfg.badge + '18', color: cfg.badge, border: `1px solid ${cfg.badge}44`,
                                                    borderRadius: '20px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700, whiteSpace: 'nowrap'
                                                }}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: 0 }}>
                                                Applied {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>

                                        {/* ATS Score */}
                                        <div style={{ padding: '14px 20px 0' }}>
                                            {app.atsScore !== null && app.atsScore !== undefined ? (
                                                <>
                                                    <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        ATS Skill Match
                                                    </p>
                                                    <AtsGauge score={app.atsScore} />
                                                </>
                                            ) : (
                                                <p style={{ fontSize: '0.78rem', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '10px' }}>
                                                    ATS score unavailable — no required skills set for this listing.
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div style={{ padding: '0 20px 14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {app.candidateResumeUrl && (
                                                <a href={app.candidateResumeUrl} target="_blank" rel="noopener noreferrer"
                                                    style={{
                                                        flex: 1, textAlign: 'center', padding: '7px 12px', borderRadius: '7px',
                                                        background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe',
                                                        fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none'
                                                    }}>
                                                    View Resume &#8599;
                                                </a>
                                            )}
                                            {app.coverLetter && (
                                                <button onClick={() => setExpandedCoverLetter(expandedCoverLetter === app.id ? null : app.id)}
                                                    style={{
                                                        flex: 1, padding: '7px 12px', borderRadius: '7px',
                                                        background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0',
                                                        fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                                                    }}>
                                                    {expandedCoverLetter === app.id ? 'Hide Letter' : 'Cover Letter'}
                                                </button>
                                            )}
                                        </div>

                                        {expandedCoverLetter === app.id && app.coverLetter && (
                                            <div style={{ margin: '0 20px 14px', background: '#f8fafc', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0' }}>
                                                <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.83rem', color: '#374151', lineHeight: '1.65' }}>
                                                    {app.coverLetter}
                                                </p>
                                            </div>
                                        )}

                                        {/* Status update */}
                                        <div style={{ padding: '12px 20px 16px', borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                                Update Status
                                            </p>
                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                {ALL_STATUSES.map(s => {
                                                    const scfg = STATUS_CONFIG[s];
                                                    const isActive = app.status === s;
                                                    return (
                                                        <button key={s}
                                                            onClick={() => updateStatus(app.id, s)}
                                                            disabled={updatingId === app.id || isActive}
                                                            style={{
                                                                padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: isActive ? 'default' : 'pointer',
                                                                background: isActive ? scfg.badge : 'transparent',
                                                                color: isActive ? '#fff' : scfg.badge,
                                                                border: `1px solid ${scfg.badge}`,
                                                                opacity: updatingId === app.id && !isActive ? 0.5 : 1,
                                                                transition: 'all 0.15s'
                                                            }}>
                                                            {updatingId === app.id && !isActive
                                                                ? <span className="spinner-border spinner-border-sm" style={{ width: '10px', height: '10px' }}></span>
                                                                : scfg.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewApplicants;

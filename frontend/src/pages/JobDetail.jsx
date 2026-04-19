import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const formatINR = (amount) => {
    if (!amount) return 'Unpaid / Negotiable';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

const MetaBox = ({ label, value, valueStyle }) => (
    <div style={{ background: '#f8fafc', border: '1px solid #e8edf5', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.73rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '4px' }}>{label}</div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b', ...valueStyle }}>{value}</div>
    </div>
);

const JobDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [applyStatus, setApplyStatus] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    useEffect(() => {
        api.get(`/jobs/${id}`).then(r => setJob(r.data)).catch(() => setError('Failed to load job details.')).finally(() => setLoading(false));
        if (user?.role === 'CANDIDATE') {
            api.get('/applications/my-applications').then(r => setAlreadyApplied(r.data.some(a => a.jobListingId === parseInt(id)))).catch(() => {});
        }
    }, [id, user]);

    const handleApply = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setApplyStatus('');
        try {
            await api.post(`/applications/${id}`, { coverLetter });
            setApplyStatus('success');
            setAlreadyApplied(true);
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || 'Failed to apply.';
            setApplyStatus(typeof msg === 'object' ? JSON.stringify(msg) : msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', paddingTop: '80px' }}><div className="spinner-border text-primary" role="status"></div></div>;
    if (error) return <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px', marginTop: '24px', color: '#b91c1c' }}>{error}</div>;
    if (!job) return null;

    const isDeadlinePassed = job.deadline && new Date(job.deadline) < new Date();
    const isClosed = job.status === 'CLOSED' || isDeadlinePassed;

    return (
        <div className="row mt-2">
            {/* Main content */}
            <div className="col-lg-8">
                <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px', overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '28px', color: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                            <div>
                                <h2 style={{ fontWeight: 800, marginBottom: '6px', fontSize: '1.4rem' }}>{job.title}</h2>
                                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 0, fontSize: '0.95rem' }}>{job.companyName} &bull; {job.location}</p>
                            </div>
                            <span style={{
                                background: job.type === 'JOB' ? 'rgba(99,102,241,0.3)' : 'rgba(16,185,129,0.3)',
                                color: job.type === 'JOB' ? '#a5b4fc' : '#6ee7b7',
                                border: `1px solid ${job.type === 'JOB' ? 'rgba(99,102,241,0.5)' : 'rgba(16,185,129,0.5)'}`,
                                borderRadius: '20px', padding: '5px 14px', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap'
                            }}>{job.type}</span>
                        </div>
                    </div>

                    <div style={{ padding: '28px' }}>
                        {/* Meta boxes */}
                        <div className="row g-3 mb-4">
                            <div className="col-6 col-sm-3"><MetaBox label="Category" value={job.categoryName} /></div>
                            <div className="col-6 col-sm-3"><MetaBox label="Salary / Stipend" value={formatINR(job.salary)} valueStyle={{ color: '#10b981' }} /></div>
                            <div className="col-6 col-sm-3"><MetaBox label="Deadline" value={new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} valueStyle={isDeadlinePassed ? { color: '#dc2626' } : {}} /></div>
                            <div className="col-6 col-sm-3"><MetaBox label="Applicants" value={job.applicationCount ?? '—'} /></div>
                        </div>

                        {isClosed && (
                            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#92400e', fontSize: '0.875rem' }}>
                                {isDeadlinePassed ? 'The application deadline has passed for this listing.' : 'This listing is currently closed.'}
                            </div>
                        )}

                        {/* Required Skills */}
                        {job.requiredSkills?.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                <h6 style={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.75rem', marginBottom: '10px' }}>Required Skills</h6>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {job.requiredSkills.map(skill => (
                                        <span key={skill} style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', borderRadius: '20px', padding: '4px 12px', fontSize: '0.82rem', fontWeight: 600 }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <hr style={{ borderColor: '#f1f5f9', margin: '0 0 24px' }} />
                        <h4 style={{ fontWeight: 700, marginBottom: '14px' }}>Job Description</h4>
                        <p style={{ whiteSpace: 'pre-wrap', color: '#374151', lineHeight: '1.75' }}>{job.description}</p>
                    </div>
                </div>
            </div>

            {/* Sidebar apply panel */}
            <div className="col-lg-4">
                <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '24px', position: 'sticky', top: '16px' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '18px' }}>Apply for this Role</h4>

                    {!user ? (
                        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px', color: '#92400e', fontSize: '0.875rem' }}>
                            Please <a href="/login" style={{ color: '#6366f1' }}>sign in</a> as a candidate to apply.
                        </div>
                    ) : user.role !== 'CANDIDATE' ? (
                        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '14px', color: '#0369a1', fontSize: '0.875rem' }}>
                            Only candidates can apply for job listings.
                        </div>
                    ) : alreadyApplied || applyStatus === 'success' ? (
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px', color: '#15803d' }}>
                            <div style={{ fontWeight: 700, marginBottom: '4px' }}>Application Submitted</div>
                            <div style={{ fontSize: '0.85rem' }}>Track your status in <a href="/candidate/applications" style={{ color: '#6366f1' }}>My Applications</a>.</div>
                        </div>
                    ) : (
                        <form onSubmit={handleApply}>
                            {applyStatus && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '11px 14px', marginBottom: '14px', color: '#b91c1c', fontSize: '0.85rem' }}>{applyStatus}</div>}
                            <div style={{ marginBottom: '16px' }}>
                                <label className="form-label">Cover Letter <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
                                <textarea className="form-control" rows="5" placeholder="Why are you a great fit for this role?" value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" style={{ padding: '12px', fontWeight: 700 }} disabled={submitting || isClosed}>
                                {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</> : isClosed ? 'Applications Closed' : 'Submit Application'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
export default JobDetail;

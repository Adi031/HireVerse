import { Link } from 'react-router-dom';

const formatINR = (amount) => {
    if (!amount) return 'Negotiable';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    return Math.ceil((new Date(deadline) - new Date()) / 86400000);
};

const JobCard = ({ job }) => {
    const daysLeft = getDaysLeft(job.deadline);
    const isExpired = daysLeft !== null && daysLeft < 0;
    const isClosingSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
    const isInternship = job.type === 'INTERNSHIP';

    return (
        <div style={{
            background: '#fff', border: '1px solid #e8edf5', borderRadius: '14px',
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)', height: '100%', display: 'flex',
            flexDirection: 'column', transition: 'transform 0.15s, box-shadow 0.15s',
            opacity: isExpired ? 0.7 : 1
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)'; }}>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Badges row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{
                            background: isInternship ? '#ecfeff' : '#eef2ff',
                            color: isInternship ? '#0e7490' : '#4338ca',
                            border: `1px solid ${isInternship ? '#a5f3fc' : '#c7d2fe'}`,
                            borderRadius: '20px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700
                        }}>{job.type}</span>
                        {isClosingSoon && !isExpired && (
                            <span style={{ background: '#fef9c3', color: '#854d0e', border: '1px solid #fde68a', borderRadius: '20px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700 }}>
                                Closing in {daysLeft}d
                            </span>
                        )}
                        {isExpired && (
                            <span style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 600 }}>Closed</span>
                        )}
                    </div>
                    <span style={{ fontSize: '0.73rem', color: '#94a3b8' }}>{new Date(job.postedAt).toLocaleDateString('en-IN')}</span>
                </div>

                {/* Title & company */}
                <h5 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px', fontSize: '1rem' }}>{job.title}</h5>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '6px' }}>{job.companyName}</p>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{job.location}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{job.categoryName}</span>
                </div>

                {/* Description snippet */}
                <p style={{ color: '#64748b', fontSize: '0.83rem', flex: 1, marginBottom: '16px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.6' }}>
                    {job.description}
                </p>

                {/* Footer */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.875rem' }}>{formatINR(job.salary)}</div>
                        {job.applicationCount !== undefined && (
                            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}</div>
                        )}
                    </div>
                    <Link to={`/jobs/${job.id}`} style={{
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff',
                        borderRadius: '8px', padding: '7px 16px', fontSize: '0.82rem',
                        fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap'
                    }}>View Details</Link>
                </div>
            </div>
        </div>
    );
};
export default JobCard;

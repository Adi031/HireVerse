import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

const SKILL_PALETTES = [
    { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
    { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    { bg: '#fefce8', text: '#a16207', border: '#fde68a' },
    { bg: '#fdf2f8', text: '#9d174d', border: '#fbcfe8' },
    { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
    { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
    { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc' },
    { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
];

const InfoSection = ({ title, content }) => (
    <div style={{ marginBottom: '24px' }}>
        <h6 style={{ fontWeight: 700, color: '#374151', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            {title}
        </h6>
        <p style={{ color: '#4b5563', whiteSpace: 'pre-wrap', lineHeight: '1.7', margin: 0 }}>
            {content || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not provided</span>}
        </p>
    </div>
);

const CandidateView = () => {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/candidate/profile/${id}`)
            .then(r => setCandidate(r.data))
            .catch(() => setError('Failed to load candidate profile. They may not have completed their profile yet.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <div className="spinner-border text-primary" role="status"></div>
            <p style={{ marginTop: '12px', color: '#6b7280' }}>Loading candidate profile...</p>
        </div>
    );

    if (error) return (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px', marginTop: '24px', color: '#b91c1c' }}>
            {error}
        </div>
    );

    if (!candidate) return (
        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '20px', marginTop: '24px', color: '#0369a1' }}>
            Candidate profile not found.
        </div>
    );

    const initials = candidate.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'CV';
    const hasSkills = candidate.skills && candidate.skills.length > 0;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', paddingTop: '16px', paddingBottom: '40px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>Candidate Profile</h2>
                <button
                    onClick={() => window.history.back()}
                    style={{
                        background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px',
                        padding: '8px 16px', cursor: 'pointer', color: '#475569', fontWeight: 600, fontSize: '0.85rem'
                    }}>
                    &#8592; Back
                </button>
            </div>

            {/* Profile Card */}
            <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' }}>

                {/* Header banner */}
                <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '28px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #10b981)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 800, fontSize: '1.5rem', flexShrink: 0
                    }}>
                        {initials}
                    </div>
                    <div>
                        <h3 style={{ color: '#fff', fontWeight: 700, margin: 0, fontSize: '1.25rem' }}>{candidate.name}</h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', margin: '4px 0 0', fontSize: '0.9rem' }}>{candidate.email}</p>
                    </div>
                </div>

                <div style={{ padding: '28px' }}>

                    {/* Bio */}
                    {candidate.bio && (
                        <div style={{
                            background: '#f8fafc', borderRadius: '10px', padding: '16px',
                            borderLeft: '4px solid #6366f1', marginBottom: '24px'
                        }}>
                            <p style={{ color: '#374151', margin: 0, lineHeight: '1.7', fontStyle: 'italic' }}>
                                "{candidate.bio}"
                            </p>
                        </div>
                    )}

                    {/* Resume */}
                    <div style={{ marginBottom: '24px' }}>
                        <h6 style={{ fontWeight: 700, color: '#374151', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                            Resume
                        </h6>
                        {candidate.resumeUrl ? (
                            <a
                                href={candidate.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe',
                                    borderRadius: '8px', padding: '8px 16px', textDecoration: 'none',
                                    fontWeight: 600, fontSize: '0.875rem'
                                }}
                            >
                                View Resume &#8599;
                            </a>
                        ) : (
                            <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.9rem' }}>No resume link provided.</span>
                        )}
                    </div>

                    {/* Skills */}
                    <div style={{ marginBottom: '24px' }}>
                        <h6 style={{ fontWeight: 700, color: '#374151', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                            Skills {hasSkills && <span style={{ color: '#6366f1', fontSize: '0.8rem', fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>— {candidate.skills.length} listed</span>}
                        </h6>
                        {hasSkills ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {candidate.skills.map((skill, idx) => {
                                    const p = SKILL_PALETTES[idx % SKILL_PALETTES.length];
                                    return (
                                        <span key={skill} style={{
                                            background: p.bg, color: p.text, border: `1px solid ${p.border}`,
                                            borderRadius: '20px', padding: '5px 14px',
                                            fontSize: '0.82rem', fontWeight: 600
                                        }}>
                                            {skill}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.9rem' }}>No skills listed.</span>
                        )}
                    </div>

                    <hr style={{ borderColor: '#f1f5f9', margin: '0 0 24px' }} />

                    <InfoSection title="Education" content={candidate.education} />
                    <InfoSection title="Work Experience" content={candidate.experience} />
                </div>
            </div>
        </div>
    );
};

export default CandidateView;

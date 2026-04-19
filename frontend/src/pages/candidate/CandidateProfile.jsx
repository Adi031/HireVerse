import { useState, useEffect } from 'react';
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

const SectionCard = ({ icon, title, children }) => (
    <div className="mb-4" style={{
        background: '#fff',
        border: '1px solid #e8edf5',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)'
    }}>
        <div style={{
            padding: '14px 22px',
            borderBottom: '1px solid #f1f5f9',
            background: '#fafbfd',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}>
            <span style={{ fontSize: '1.1rem' }}>{icon}</span>
            <span style={{ fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>{title}</span>
        </div>
        <div style={{ padding: '22px' }}>
            {children}
        </div>
    </div>
);

const CandidateProfile = () => {
    const [formData, setFormData] = useState({ name: '', bio: '', education: '', experience: '', skills: '', resumeUrl: '' });
    const [skillInput, setSkillInput] = useState('');
    const [skillsList, setSkillsList] = useState([]);
    const [saved, setSaved] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/candidate/profile').then(r => {
            const fetchedSkills = r.data.skills || [];
            setFormData({
                name: r.data.name || '',
                bio: r.data.bio || '',
                education: r.data.education || '',
                experience: r.data.experience || '',
                skills: fetchedSkills.join(', '),
                resumeUrl: r.data.resumeUrl || ''
            });
            setSkillsList(fetchedSkills);
        }).catch(() => {
            setError('Failed to load profile. Please refresh the page.');
        });
    }, []);

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !skillsList.includes(s)) {
            const updated = [...skillsList, s];
            setSkillsList(updated);
            setFormData(prev => ({ ...prev, skills: updated.join(', ') }));
        }
        setSkillInput('');
    };

    const removeSkill = (skill) => {
        const updated = skillsList.filter(s => s !== skill);
        setSkillsList(updated);
        setFormData(prev => ({ ...prev, skills: updated.join(', ') }));
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkill();
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const payload = { ...formData, skills: skillsList, resumeUrl: formData.resumeUrl || null };
            await api.put('/candidate/profile', payload);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            if (formData.name) localStorage.setItem('userName', formData.name);
        } catch (err) {
            setError(err.response?.data || err.message || 'Failed to save profile');
        } finally {
            setSubmitting(false);
        }
    };

    // Profile completeness
    const fields = [formData.name, formData.bio, formData.education, formData.experience, formData.resumeUrl];
    const filledFields = fields.filter(f => f && f.trim()).length + (skillsList.length > 0 ? 1 : 0);
    const totalFields = 6;
    const completeness = Math.round((filledFields / totalFields) * 100);

    const completenessColor = completeness >= 80 ? '#10b981' : completeness >= 50 ? '#f59e0b' : '#ef4444';

    return (
        <div style={{ maxWidth: '760px', margin: '0 auto', paddingTop: '8px' }}>

            {/* Header */}
            <div className="mb-4">
                <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: '#0f172a', marginBottom: '4px' }}>My Profile</h2>
                <p style={{ color: '#64748b', marginBottom: '16px' }}>
                    A complete profile helps recruiters find you — and boosts your ATS match score on applications.
                </p>

                {/* Completeness bar */}
                <div style={{
                    background: '#f1f5f9',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Profile Completeness</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: completenessColor }}>{completeness}%</span>
                        </div>
                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${completeness}%`,
                                background: completenessColor,
                                borderRadius: '99px',
                                transition: 'width 0.6s ease'
                            }} />
                        </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {filledFields}/{totalFields} sections
                    </span>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div style={{
                    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px',
                    padding: '12px 16px', marginBottom: '16px', color: '#b91c1c',
                    display: 'flex', alignItems: 'flex-start', gap: '10px'
                }}>
                    <span>&#9888;</span>
                    <span style={{ flex: 1 }}>{typeof error === 'object' ? JSON.stringify(error) : error}</span>
                    <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c', padding: 0, lineHeight: 1 }}>&#x2715;</button>
                </div>
            )}
            {saved && (
                <div style={{
                    background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px',
                    padding: '12px 16px', marginBottom: '16px', color: '#15803d',
                    display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                    <span>&#10003;</span> Profile saved successfully!
                </div>
            )}

            <form onSubmit={handleSave}>

                {/* Personal Info */}
                <SectionCard icon="&#128100;" title="Personal Information">
                    <div className="mb-3">
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.88rem', color: '#374151' }}>Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                            style={{ borderRadius: '8px', border: '1.5px solid #e2e8f0', padding: '10px 14px' }}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.88rem', color: '#374151' }}>
                            Professional Bio <span style={{ color: '#94a3b8', fontWeight: 400 }}>(max 500 chars)</span>
                        </label>
                        <textarea
                            className="form-control"
                            rows="3"
                            maxLength="500"
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Write a concise summary of your background, interests, and career goals..."
                            style={{ borderRadius: '8px', border: '1.5px solid #e2e8f0', padding: '10px 14px', resize: 'vertical' }}
                        />
                        <div style={{ textAlign: 'right' }}>
                            <small style={{ color: formData.bio.length > 450 ? '#ef4444' : '#94a3b8' }}>{formData.bio.length}/500</small>
                        </div>
                    </div>
                    <div>
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.88rem', color: '#374151' }}>
                            Resume Link <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Google Drive, LinkedIn, etc.)</span>
                        </label>
                        <input
                            type="url"
                            className="form-control"
                            value={formData.resumeUrl}
                            onChange={e => setFormData({ ...formData, resumeUrl: e.target.value })}
                            placeholder="https://drive.google.com/file/d/your-resume"
                            style={{ borderRadius: '8px', border: '1.5px solid #e2e8f0', padding: '10px 14px' }}
                        />
                        <small style={{ color: '#94a3b8', display: 'block', marginTop: '6px' }}>
                            Paste a publicly accessible link. Recruiters will see this when you apply.
                        </small>
                    </div>
                </SectionCard>

                {/* Background */}
                <SectionCard icon="&#127891;" title="Academic & Professional Background">
                    <div className="mb-3">
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.88rem', color: '#374151' }}>Education</label>
                        <input
                            type="text"
                            className="form-control"
                            maxLength="300"
                            value={formData.education}
                            onChange={e => setFormData({ ...formData, education: e.target.value })}
                            placeholder="e.g.  B.Tech in Computer Science, XYZ University (2021–2025)"
                            style={{ borderRadius: '8px', border: '1.5px solid #e2e8f0', padding: '10px 14px' }}
                        />
                    </div>
                    <div>
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.88rem', color: '#374151' }}>Work Experience</label>
                        <textarea
                            className="form-control"
                            rows="5"
                            value={formData.experience}
                            onChange={e => setFormData({ ...formData, experience: e.target.value })}
                            placeholder="Describe internships, projects, or roles. Include tech stack and outcomes where possible..."
                            style={{ borderRadius: '8px', border: '1.5px solid #e2e8f0', padding: '10px 14px', resize: 'vertical' }}
                        />
                        <small style={{ color: '#94a3b8', marginTop: '5px', display: 'block' }}>
                            Tip: Mentioning technologies here can improve your ATS match score on job applications.
                        </small>
                    </div>
                </SectionCard>

                {/* Skills */}
                <SectionCard icon="&#128295;" title="Skills">
                    {skillsList.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                            {skillsList.map((skill, idx) => {
                                const palette = SKILL_PALETTES[idx % SKILL_PALETTES.length];
                                return (
                                    <span key={skill} style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: palette.bg,
                                        color: palette.text,
                                        border: `1px solid ${palette.border}`,
                                        borderRadius: '20px',
                                        padding: '5px 12px',
                                        fontSize: '0.83rem',
                                        fontWeight: 600,
                                        transition: 'all 0.15s'
                                    }}>
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                padding: '0', color: palette.text, opacity: 0.6,
                                                lineHeight: 1, fontWeight: 700, fontSize: '1rem',
                                                display: 'flex', alignItems: 'center'
                                            }}
                                            title={`Remove ${skill}`}
                                        >&#x2715;</button>
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {skillsList.length === 0 && (
                        <div style={{
                            background: '#f8fafc', borderRadius: '8px', padding: '16px', marginBottom: '16px',
                            textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', border: '1px dashed #e2e8f0'
                        }}>
                            No skills added yet. Add your technical and professional skills below.
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Java, React, Spring Boot, MySQL..."
                            value={skillInput}
                            onChange={e => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillKeyDown}
                            style={{ borderRadius: '8px', border: '1.5px solid #e2e8f0', padding: '10px 14px', flex: 1 }}
                        />
                        <button
                            type="button"
                            onClick={addSkill}
                            style={{
                                background: '#6366f1', color: '#fff', border: 'none',
                                borderRadius: '8px', padding: '10px 18px', fontWeight: 600, cursor: 'pointer',
                                whiteSpace: 'nowrap', fontSize: '0.88rem'
                            }}
                        >+ Add</button>
                    </div>
                    <small style={{ color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                        Press Enter or comma after each skill. Skills are matched against job requirements for ATS scoring.
                    </small>
                </SectionCard>

                {/* Save Button */}
                <div style={{ paddingBottom: '24px' }}>
                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '12px 36px',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {submitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm" style={{ width: '16px', height: '16px' }}></span>
                                Saving...
                            </>
                        ) : 'Save Profile'}
                    </button>
                    <span style={{ marginLeft: '14px', fontSize: '0.82rem', color: '#94a3b8' }}>
                        Changes are saved immediately to your account.
                    </span>
                </div>
            </form>
        </div>
    );
};

export default CandidateProfile;

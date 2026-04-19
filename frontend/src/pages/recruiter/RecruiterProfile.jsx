import { useState, useEffect } from 'react';
import api from '../../api/axios';

const RecruiterProfile = () => {
    const [formData, setFormData] = useState({ name: '', companyName: '', website: '', description: '' });
    const [saved, setSaved] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/recruiter/profile').then(r => setFormData({ name: r.data.name || '', companyName: r.data.companyName || '', website: r.data.website || '', description: r.data.description || '' })).catch(() => setError('Failed to load profile.'));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await api.put('/recruiter/profile', formData);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            if (formData.name) localStorage.setItem('userName', formData.name);
        } catch (err) {
            setError(err.response?.data || err.message || 'Failed to save profile.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Company Profile</h2>
                <p style={{ color: '#64748b', marginBottom: 0 }}>This information is shown to candidates when they view your listings.</p>
            </div>

            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#b91c1c', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}><span>{typeof error === 'object' ? JSON.stringify(error) : error}</span><button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c' }}>&#x2715;</button></div>}
            {saved && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#15803d', fontSize: '0.875rem' }}>Profile saved successfully.</div>}

            <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                <form onSubmit={handleSave}>
                    <div style={{ marginBottom: '18px' }}>
                        <label className="form-label">Your Full Name</label>
                        <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div style={{ marginBottom: '18px' }}>
                        <label className="form-label">Company Name</label>
                        <input type="text" className="form-control" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} required />
                    </div>
                    <div style={{ marginBottom: '18px' }}>
                        <label className="form-label">Company Website <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
                        <input type="url" className="form-control" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://yourcompany.com" />
                    </div>
                    <div style={{ marginBottom: '26px' }}>
                        <label className="form-label">Company Description</label>
                        <textarea className="form-control" rows="5" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Tell candidates about your company, culture and mission..." />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '11px 32px', fontWeight: 700 }} disabled={submitting}>
                        {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default RecruiterProfile;

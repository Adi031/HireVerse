import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const PostJob = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({ title: '', description: '', location: '', type: 'JOB', salary: '', deadline: '', categoryName: '', requiredSkills: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => { api.get('/jobs/categories').then(r => setCategories(r.data)).catch(() => {}); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        const payload = { ...formData, salary: formData.salary === '' ? null : parseFloat(formData.salary), requiredSkills: formData.requiredSkills ? formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : [] };
        try {
            await api.post('/jobs', payload);
            navigate('/recruiter/listings');
        } catch (err) {
            const data = err.response?.data;
            setError(typeof data === 'string' ? data : data?.message ? data.message : typeof data === 'object' && data ? Object.values(data).join(' • ') : 'Failed to post listing. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const labelStyle = { fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '6px' };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Post a New Listing</h2>
                <p style={{ color: '#64748b', marginBottom: 0 }}>Fill in the details below to publish a job or internship.</p>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#b91c1c', fontSize: '0.875rem' }}>{error}</div>
            )}

            <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                <form onSubmit={handleSubmit}>

                    {/* Type toggle */}
                    <div style={{ marginBottom: '22px' }}>
                        <label style={labelStyle}>Listing Type</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {[{ v: 'JOB', label: 'Job' }, { v: 'INTERNSHIP', label: 'Internship' }].map(opt => (
                                <div key={opt.v} onClick={() => setFormData({ ...formData, type: opt.v })} style={{ flex: 1, padding: '12px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center', border: `2px solid ${formData.type === opt.v ? '#6366f1' : '#e2e8f0'}`, background: formData.type === opt.v ? '#eef2ff' : '#fff', fontWeight: 700, color: formData.type === opt.v ? '#4338ca' : '#64748b', transition: 'all 0.15s' }}>
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                        <label className="form-label">Job Title</label>
                        <input type="text" name="title" className="form-control" onChange={handleChange} required placeholder="e.g. Software Engineer — Backend" />
                    </div>

                    <div className="row">
                        <div className="col-md-6" style={{ marginBottom: '18px' }}>
                            <label className="form-label">Location</label>
                            <input type="text" name="location" className="form-control" onChange={handleChange} required placeholder="e.g. Bangalore or Remote" />
                        </div>
                        <div className="col-md-6" style={{ marginBottom: '18px' }}>
                            <label className="form-label">Category</label>
                            <select name="categoryName" className="form-select" value={formData.categoryName} onChange={handleChange} required>
                                <option value="">— Select Category —</option>
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6" style={{ marginBottom: '18px' }}>
                            <label className="form-label">Salary / Stipend <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
                            <input type="number" name="salary" className="form-control" onChange={handleChange} placeholder="Monthly amount in INR" />
                        </div>
                        <div className="col-md-6" style={{ marginBottom: '18px' }}>
                            <label className="form-label">Application Deadline</label>
                            <input type="date" name="deadline" className="form-control" min={today} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                        <label className="form-label">Required Skills <span style={{ color: '#94a3b8', fontWeight: 400 }}>(comma-separated)</span></label>
                        <input type="text" name="requiredSkills" className="form-control" placeholder="e.g. Java, Spring Boot, MySQL, React" value={formData.requiredSkills} onChange={handleChange} />
                        <small style={{ color: '#94a3b8', marginTop: '5px', display: 'block' }}>These skills are used for ATS matching when candidates apply.</small>
                    </div>

                    <div style={{ marginBottom: '26px' }}>
                        <label className="form-label">Full Description</label>
                        <textarea name="description" className="form-control" rows="7" onChange={handleChange} required placeholder="Describe the role, responsibilities, and what you're looking for..." />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '12px 36px', fontWeight: 700, fontSize: '0.95rem' }} disabled={submitting}>
                        {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Publishing...</> : 'Publish Listing'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default PostJob;

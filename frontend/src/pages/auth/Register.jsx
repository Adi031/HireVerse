import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'CANDIDATE', companyName: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const response = await api.post('/auth/register', formData);
            login(response.data);
            if (response.data.role === 'CANDIDATE') navigate('/candidate/dashboard');
            else if (response.data.role === 'RECRUITER') navigate('/recruiter/dashboard');
        } catch (err) {
            if (typeof err.response?.data === 'object') setError(Object.values(err.response.data).join(', '));
            else setError(err.response?.data || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    const roleTab = (value, label, desc) => (
        <div onClick={() => setFormData({ ...formData, role: value })} style={{
            flex: 1, padding: '14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
            border: `2px solid ${formData.role === value ? '#6366f1' : '#e2e8f0'}`,
            background: formData.role === value ? '#eef2ff' : '#fff', transition: 'all 0.15s'
        }}>
            <div style={{ fontWeight: 700, color: formData.role === value ? '#4338ca' : '#374151', fontSize: '0.9rem' }}>{label}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}>{desc}</div>
        </div>
    );

    return (
        <div style={{ minHeight: '78vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '16px', paddingBottom: '32px' }}>
            <div style={{ width: '100%', maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <span style={{ background: 'linear-gradient(135deg, #6366f1, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '1.8rem', display: 'inline-block' }}>HireVerse</span>
                    <p style={{ color: '#64748b', marginTop: '6px', fontSize: '0.9rem', marginBottom: 0 }}>Create your account to get started</p>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
                    {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '11px 14px', marginBottom: '18px', color: '#b91c1c', fontSize: '0.875rem' }}>{error}</div>}

                    {/* Role selector */}
                    <div style={{ marginBottom: '22px' }}>
                        <label className="form-label">I want to...</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {roleTab('CANDIDATE', 'Find a Job', 'Browse & apply')}
                            {roleTab('RECRUITER', 'Hire Talent', 'Post & manage jobs')}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6" style={{ marginBottom: '16px' }}>
                                <label className="form-label">Full Name</label>
                                <input type="text" name="name" className="form-control" onChange={handleChange} required placeholder="Your full name" />
                            </div>
                            <div className="col-md-6" style={{ marginBottom: '16px' }}>
                                <label className="form-label">Email</label>
                                <input type="email" name="email" className="form-control" onChange={handleChange} required placeholder="you@example.com" />
                            </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label className="form-label">Password <span style={{ color: '#94a3b8', fontWeight: 400 }}>(min. 8 characters)</span></label>
                            <input type="password" name="password" className="form-control" onChange={handleChange} minLength="8" required placeholder="Choose a strong password" />
                        </div>
                        {formData.role === 'RECRUITER' && (
                            <div style={{ marginBottom: '16px' }}>
                                <label className="form-label">Company Name</label>
                                <input type="text" name="companyName" className="form-control" onChange={handleChange} required placeholder="Your company or organisation" />
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary w-100" style={{ padding: '11px', fontWeight: 700, fontSize: '0.95rem', marginTop: '6px' }} disabled={submitting}>
                            {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</> : 'Create Account'}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '0.875rem', marginBottom: 0 }}>
                        Already have an account?{' '}<Link to="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Register;

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data);
            if (response.data.role === 'CANDIDATE') navigate('/candidate/dashboard');
            else if (response.data.role === 'RECRUITER') navigate('/recruiter/dashboard');
            else if (response.data.role === 'ADMIN') navigate('/admin/dashboard');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data || 'Login failed. Please check your credentials.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: '78vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <span style={{ background: 'linear-gradient(135deg, #6366f1, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '1.8rem', display: 'inline-block' }}>HireVerse</span>
                    <p style={{ color: '#64748b', marginTop: '6px', fontSize: '0.9rem', marginBottom: 0 }}>Sign in to your account</p>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
                    {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '11px 14px', marginBottom: '18px', color: '#b91c1c', fontSize: '0.875rem' }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label className="form-label">Email address</label>
                            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
                        </div>
                        <div style={{ marginBottom: '22px' }}>
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Your password" />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" style={{ padding: '11px', fontWeight: 700, fontSize: '0.95rem' }} disabled={submitting}>
                            {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</> : 'Sign In'}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '0.875rem', marginBottom: 0 }}>
                        Don't have an account?{' '}<Link to="/register" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Login;

import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';

const StatCard = ({ value, label, gradStart, gradEnd }) => (
    <div style={{ background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`, borderRadius: '14px', padding: '22px', color: '#fff', boxShadow: `0 4px 18px ${gradStart}55` }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px' }}>{value}</div>
        <div style={{ fontSize: '0.82rem', opacity: 0.85 }}>{label}</div>
    </div>
);

const ActionCard = ({ title, desc, to, btnLabel, btnStyle }) => (
    <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h6 style={{ fontWeight: 700, marginBottom: '6px' }}>{title}</h6>
        <p style={{ color: '#64748b', fontSize: '0.85rem', flex: 1 }}>{desc}</p>
        <Link to={to} style={{ display: 'inline-block', padding: '8px 18px', borderRadius: '8px', fontSize: '0.83rem', fontWeight: 600, textDecoration: 'none', ...btnStyle, alignSelf: 'flex-start' }}>
            {btnLabel}
        </Link>
    </div>
);

const RecruiterDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ total: 0, active: 0, closed: 0, totalApplicants: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/jobs/recruiter/my-listings').then(r => {
            const jobs = r.data;
            setStats({ total: jobs.length, active: jobs.filter(j => j.status === 'ACTIVE').length, closed: jobs.filter(j => j.status !== 'ACTIVE').length, totalApplicants: jobs.reduce((s, j) => s + (j.applicationCount || 0), 0) });
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const v = (n) => loading ? '—' : n;

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    Welcome back, <span style={{ color: '#6366f1' }}>{user?.name || user?.email}</span>
                </h2>
                <p style={{ color: '#64748b', marginBottom: 0 }}>Manage your listings and review incoming applications.</p>
            </div>

            <div className="row g-3 mb-5">
                <div className="col-6 col-md-3"><StatCard value={v(stats.total)} label="Total Listings" gradStart="#6366f1" gradEnd="#4f46e5" /></div>
                <div className="col-6 col-md-3"><StatCard value={v(stats.active)} label="Active Listings" gradStart="#10b981" gradEnd="#059669" /></div>
                <div className="col-6 col-md-3"><StatCard value={v(stats.closed)} label="Closed Listings" gradStart="#64748b" gradEnd="#475569" /></div>
                <div className="col-6 col-md-3"><StatCard value={v(stats.totalApplicants)} label="Total Applicants" gradStart="#f59e0b" gradEnd="#d97706" /></div>
            </div>

            <h5 style={{ fontWeight: 700, marginBottom: '16px' }}>Quick Actions</h5>
            <div className="row g-3">
                <div className="col-md-4">
                    <ActionCard title="Post a New Job" desc="Create a new job or internship listing and start receiving applications." to="/recruiter/post-job" btnLabel="Post a Job" btnStyle={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff' }} />
                </div>
                <div className="col-md-4">
                    <ActionCard title="My Listings" desc="View, edit and manage all your active and closed job listings." to="/recruiter/listings" btnLabel="View Listings" btnStyle={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }} />
                </div>
                <div className="col-md-4">
                    <ActionCard title="Company Profile" desc="Update your company info so candidates know who they are applying to." to="/recruiter/profile" btnLabel="Edit Profile" btnStyle={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }} />
                </div>
            </div>
        </div>
    );
};
export default RecruiterDashboard;

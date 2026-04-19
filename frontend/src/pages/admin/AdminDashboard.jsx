import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const StatCard = ({ value, label, gradStart, gradEnd }) => (
    <div style={{ background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`, borderRadius: '14px', padding: '24px', color: '#fff', boxShadow: `0 4px 18px ${gradStart}55` }}>
        <div style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '4px' }}>{value}</div>
        <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>{label}</div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchData = async () => {
        try {
            const [sRes, uRes] = await Promise.all([api.get('/admin/stats'), api.get('/admin/users')]);
            setStats(sRes.data);
            setUsers(uRes.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const toggleUser = async (id) => {
        try {
            await api.put(`/admin/users/${id}/toggle`);
            setMessage({ type: 'success', text: 'User status updated.' });
            fetchData();
        } catch { setMessage({ type: 'danger', text: 'Failed to update user status.' }); }
    };

    if (loading) return <div style={{ textAlign: 'center', paddingTop: '80px' }}><div className="spinner-border text-primary" role="status"></div></div>;

    const ROLE_STYLE = {
        ADMIN:     { bg: '#fdf2f8', color: '#9d174d', border: '#fbcfe8' },
        RECRUITER: { bg: '#eef2ff', color: '#4338ca', border: '#c7d2fe' },
        CANDIDATE: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    };

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Admin Dashboard</h2>
                <p style={{ color: '#64748b', marginBottom: 0 }}>Platform overview and user management.</p>
            </div>

            {message.text && (
                <div style={{ background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`, borderRadius: '10px', padding: '11px 16px', marginBottom: '20px', color: message.type === 'success' ? '#15803d' : '#b91c1c', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{message.text}</span><button onClick={() => setMessage({ type: '', text: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>&#x2715;</button>
                </div>
            )}

            <div className="row g-3 mb-5">
                <div className="col-md-4"><StatCard value={stats?.totalUsers || 0} label="Total Users" gradStart="#6366f1" gradEnd="#4f46e5" /></div>
                <div className="col-md-4"><StatCard value={stats?.totalJobs || 0} label="Total Job Listings" gradStart="#10b981" gradEnd="#059669" /></div>
                <div className="col-md-4"><StatCard value={stats?.totalApplications || 0} label="Total Applications" gradStart="#f59e0b" gradEnd="#d97706" /></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <h4 style={{ fontWeight: 700, margin: 0 }}>User Management</h4>
                <Link to="/admin/manage-listings" style={{ padding: '8px 18px', background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', borderRadius: '8px', fontSize: '0.83rem', fontWeight: 600, textDecoration: 'none' }}>
                    Manage All Listings &#8594;
                </Link>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => {
                                const rs = ROLE_STYLE[u.role] || ROLE_STYLE.CANDIDATE;
                                return (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{u.id}</td>
                                        <td style={{ fontWeight: 600, fontSize: '0.88rem' }}>{u.name}</td>
                                        <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{u.email}</td>
                                        <td>
                                            <span style={{ background: rs.bg, color: rs.color, border: `1px solid ${rs.border}`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700 }}>{u.role}</span>
                                        </td>
                                        <td>
                                            <span style={{ background: u.isActive ? '#f0fdf4' : '#fef2f2', color: u.isActive ? '#16a34a' : '#dc2626', border: `1px solid ${u.isActive ? '#bbf7d0' : '#fecaca'}`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700 }}>
                                                {u.isActive ? 'Active' : 'Banned'}
                                            </span>
                                        </td>
                                        <td>
                                            {u.role !== 'ADMIN' && (
                                                <button onClick={() => toggleUser(u.id)}
                                                    style={{ padding: '5px 14px', background: u.isActive ? '#fef2f2' : '#f0fdf4', color: u.isActive ? '#dc2626' : '#16a34a', border: `1px solid ${u.isActive ? '#fecaca' : '#bbf7d0'}`, borderRadius: '7px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                                                    {u.isActive ? 'Ban User' : 'Unban'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard;

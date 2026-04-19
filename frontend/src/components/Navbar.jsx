import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [jobCount, setJobCount] = useState(null);

    useEffect(() => {
        api.get('/jobs?page=0&size=1').then(res => {
            setJobCount(res.data.totalElements || null);
        }).catch(() => {});
    }, []);

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const navLinkClass = (path) =>
        `nav-link ${isActive(path) ? 'active fw-semibold' : ''}`;

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            logout();
            navigate('/');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ background: 'linear-gradient(90deg, #0f172a 0%, #1e3a5f 100%)' }}>
            <div className="container">
                <Link className="navbar-brand fw-bold fs-5 d-flex align-items-center gap-2" to="/" style={{ letterSpacing: '-0.3px' }}>
                    <span style={{
                        background: 'linear-gradient(135deg, #6366f1, #10b981)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 800,
                        fontSize: '1.4rem'
                    }}>HireVerse</span>
                </Link>
                <button className="navbar-toggler border-0" type="button"
                    data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {(!user || user.role === 'CANDIDATE') && (
                            <li className="nav-item">
                                <Link className={navLinkClass('/jobs')} to="/jobs">
                                    Browse Jobs
                                    {jobCount !== null && (
                                        <span className="badge rounded-pill bg-primary ms-1" style={{ fontSize: '0.7rem' }}>
                                            {jobCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        )}

                        {user?.role === 'CANDIDATE' && (
                            <>
                                <li className="nav-item">
                                    <Link className={navLinkClass('/candidate/dashboard')} to="/candidate/dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={navLinkClass('/candidate/profile')} to="/candidate/profile">My Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={navLinkClass('/candidate/applications')} to="/candidate/applications">My Applications</Link>
                                </li>
                            </>
                        )}

                        {user?.role === 'RECRUITER' && (
                            <>
                                <li className="nav-item">
                                    <Link className={navLinkClass('/recruiter/dashboard')} to="/recruiter/dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={navLinkClass('/recruiter/post-job')} to="/recruiter/post-job">Post a Job</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={navLinkClass('/recruiter/listings')} to="/recruiter/listings">My Listings</Link>
                                </li>
                            </>
                        )}

                        {user?.role === 'ADMIN' && (
                            <>
                                <li className="nav-item">
                                    <Link className={navLinkClass('/admin/dashboard')} to="/admin/dashboard">Admin Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={navLinkClass('/admin/listings')} to="/admin/listings">Manage Listings</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <ul className="navbar-nav ms-auto align-items-center gap-1">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="navbar-text text-white-50 small me-2">
                                        {user.name || user.email}
                                        <span className="badge ms-1 rounded-pill" style={{ background: 'rgba(99,102,241,0.35)', color: '#a5b4fc', fontSize: '0.65rem' }}>
                                            {user.role}
                                        </span>
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-sm btn-outline-light px-3" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="btn btn-sm px-3 ms-1"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #10b981)', color: '#fff', border: 'none', borderRadius: '6px' }}>
                                        Get Started
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

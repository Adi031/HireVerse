import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Footer = () => {
    const { user } = useContext(AuthContext);
    const year = new Date().getFullYear();

    const getDashboardPath = () => {
        if (!user) return null;
        if (user.role === 'CANDIDATE') return '/candidate/dashboard';
        if (user.role === 'RECRUITER') return '/recruiter/dashboard';
        if (user.role === 'ADMIN') return '/admin/dashboard';
        return null;
    };

    return (
        <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,0.6)', borderTop: '1px solid rgba(255,255,255,0.08)' }} className="mt-5 py-5">
            <div className="container">
                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <span style={{
                            background: 'linear-gradient(135deg, #6366f1, #10b981)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 800,
                            fontSize: '1.3rem',
                            display: 'inline-block'
                        }}>HireVerse</span>
                        <p className="small mt-2 mb-0" style={{ lineHeight: '1.7' }}>
                            India's intelligent job and internship platform. Connecting exceptional talent with the right opportunities.
                        </p>
                    </div>
                    <div className="col-md-4">
                        <h6 className="text-white fw-semibold mb-3">Explore</h6>
                        <ul className="list-unstyled small mb-0">
                            {(!user || user.role === 'CANDIDATE') && (
                                <li className="mb-2">
                                    <Link to="/jobs" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.6)' }}>Browse Jobs</Link>
                                </li>
                            )}
                            {user ? (
                                <li>
                                    <Link to={getDashboardPath()} className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.6)' }}>My Dashboard</Link>
                                </li>
                            ) : (
                                <>
                                    <li className="mb-2">
                                        <Link to="/register" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.6)' }}>Create Account</Link>
                                    </li>
                                    <li>
                                        <Link to="/login" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.6)' }}>Sign In</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                    <div className="col-md-4">
                        {user?.role === 'RECRUITER' ? (
                            <>
                                <h6 className="text-white fw-semibold mb-3">Recruiter Tools</h6>
                                <ul className="list-unstyled small mb-0">
                                    <li className="mb-2">
                                        <Link to="/recruiter/post-job" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.6)' }}>Post a Job</Link>
                                    </li>
                                    <li>
                                        <Link to="/recruiter/listings" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.6)' }}>My Listings</Link>
                                    </li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <h6 className="text-white fw-semibold mb-3">For Recruiters</h6>
                                <ul className="list-unstyled small mb-0">
                                    <li className="mb-2">
                                        <Link to="/register" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.6)' }}>Post a Job</Link>
                                    </li>
                                    <li>
                                        <Link to="/register" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.6)' }}>Find Talent</Link>
                                    </li>
                                </ul>
                            </>
                        )}
                    </div>
                </div>
                <hr style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <small style={{ color: 'rgba(255,255,255,0.4)' }}>&copy; {year} HireVerse. All rights reserved.</small>
                    <small style={{ color: 'rgba(255,255,255,0.4)' }}>Full-Stack Java &mdash; Spring Boot, React &amp; MySQL</small>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

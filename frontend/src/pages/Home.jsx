import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
    const [stats, setStats] = useState({ activeJobs: 0 });

    useEffect(() => {
        api.get('/jobs?page=0&size=1').then(res => {
            setStats(prev => ({ ...prev, activeJobs: res.data.totalElements || 0 }));
        }).catch(() => {});
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <div
                className="rounded-4 text-white mb-5 py-5 px-4 text-center position-relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    minHeight: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <div style={{
                    position: 'absolute', top: '-60px', right: '-60px',
                    width: '300px', height: '300px',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
                    borderRadius: '50%', pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', bottom: '-60px', left: '-60px',
                    width: '250px', height: '250px',
                    background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)',
                    borderRadius: '50%', pointerEvents: 'none'
                }} />

                <div className="position-relative">
                    <span className="badge rounded-pill mb-3 px-3 py-2"
                        style={{ background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(99,102,241,0.5)', color: '#a5b4fc', letterSpacing: '0.04em' }}>
                        India's Smart Job &amp; Internship Platform
                    </span>
                    <h1 className="display-4 fw-bold mb-3">
                        Find Your <span style={{ color: '#6366f1' }}>Dream Job</span><br />
                        or <span style={{ color: '#10b981' }}>Perfect Intern</span>
                    </h1>
                    <p className="lead mb-4 mx-auto" style={{ maxWidth: '560px', color: 'rgba(255,255,255,0.75)' }}>
                        Connect talented candidates with top recruiters. Browse curated opportunities
                        across technology, finance, design, and more.
                    </p>

                    <div className="d-flex gap-3 justify-content-center flex-wrap mb-5">
                        <Link to="/jobs" className="btn btn-lg px-5 fw-semibold"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none' }}>
                            Browse Jobs
                        </Link>
                        <Link to="/register" className="btn btn-outline-light btn-lg px-5 fw-semibold">
                            Get Started Free
                        </Link>
                    </div>

                    <div className="d-flex justify-content-center gap-4 flex-wrap">
                        {[
                            { value: stats.activeJobs > 0 ? `${stats.activeJobs}+` : '—', label: 'Active Listings' },
                            { value: '10+', label: 'Job Categories' },
                            { value: '100%', label: 'Free to Use' },
                        ].map(({ value, label }) => (
                            <div key={label} className="px-4 py-2 rounded-3"
                                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                                <div className="fw-bold fs-5">{value}</div>
                                <div className="small" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <h2 className="text-center fw-bold mb-4">How It Works</h2>
            <div className="row g-4 mb-5">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100 p-4">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center text-white"
                                style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', fontWeight: 800, fontSize: '1.1rem' }}>
                                C
                            </div>
                            <h4 className="fw-bold mb-0">For Candidates</h4>
                        </div>
                        <ul className="text-muted mb-4 ps-3">
                            <li className="mb-1">Create your professional profile</li>
                            <li className="mb-1">Browse and search job listings</li>
                            <li className="mb-1">Apply with a personalised cover letter</li>
                            <li>Track application status in real time</li>
                        </ul>
                        <Link to="/register" className="btn btn-primary mt-auto align-self-start">
                            Register as Candidate
                        </Link>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100 p-4">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center text-white"
                                style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#10b981,#059669)', fontWeight: 800, fontSize: '1.1rem' }}>
                                R
                            </div>
                            <h4 className="fw-bold mb-0">For Recruiters</h4>
                        </div>
                        <ul className="text-muted mb-4 ps-3">
                            <li className="mb-1">Post jobs and internships instantly</li>
                            <li className="mb-1">Receive and review applications</li>
                            <li className="mb-1">ATS skill-match scoring on every applicant</li>
                            <li>Manage all listings from one dashboard</li>
                        </ul>
                        <Link to="/register" className="btn btn-success mt-auto align-self-start">
                            Register as Recruiter
                        </Link>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="text-center mb-5">
                <h5 className="fw-bold mb-3 text-muted text-uppercase" style={{ letterSpacing: '0.1em', fontSize: '0.85rem' }}>
                    Browse by Category
                </h5>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                    {['Information Technology', 'Finance', 'Marketing', 'Design',
                        'Data Science', 'Management', 'Sales', 'Engineering', 'Healthcare', 'Education'].map(cat => (
                        <Link key={cat} to={`/jobs?keyword=${encodeURIComponent(cat)}`}
                            className="badge rounded-pill text-decoration-none px-3 py-2"
                            style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';

const TYPE_OPTIONS = [
    { key: 'ALL', label: 'All' },
    { key: 'JOB', label: 'Jobs' },
    { key: 'INTERNSHIP', label: 'Internships' },
];

const BrowseJobs = () => {
    const [searchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const fetchJobs = useCallback(async (resetPage = false) => {
        setLoading(true);
        const currentPage = resetPage ? 0 : page;
        try {
            if (searchTerm.trim()) {
                const response = await api.get('/jobs/search', { params: { keyword: searchTerm.trim(), type: typeFilter !== 'ALL' ? typeFilter : undefined } });
                setJobs(response.data);
                setTotalPages(1);
                setTotalElements(response.data.length);
            } else {
                const response = await api.get('/jobs', { params: { page: currentPage, size: 12 } });
                setJobs(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, typeFilter, page]);

    useEffect(() => { fetchJobs(); }, [page]);

    const displayedJobs = typeFilter !== 'ALL' ? jobs.filter(j => j.type === typeFilter) : jobs;

    const handleSearch = (e) => { e.preventDefault(); setPage(0); fetchJobs(true); };
    const handleTypeChange = (type) => { setTypeFilter(type); if (!searchTerm.trim()) setPage(0); };

    return (
        <div>
            {/* Page header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Browse Opportunities</h2>
                <p style={{ color: '#64748b', marginBottom: 0 }}>
                    {totalElements > 0 ? `${totalElements} listing${totalElements !== 1 ? 's' : ''} available` : 'Discover your next role'}
                </p>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title, location, company or category..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ flex: 2, minWidth: '220px' }}
                    />
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        {TYPE_OPTIONS.map(opt => (
                            <button key={opt.key} type="button" onClick={() => handleTypeChange(opt.key)}
                                style={{
                                    padding: '10px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                                    background: typeFilter === opt.key ? '#6366f1' : '#fff',
                                    color: typeFilter === opt.key ? '#fff' : '#475569',
                                    border: `1.5px solid ${typeFilter === opt.key ? '#6366f1' : '#e2e8f0'}`,
                                    transition: 'all 0.15s'
                                }}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    <button type="submit" style={{ padding: '10px 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        Search
                    </button>
                </div>
            </form>

            {loading ? (
                <div style={{ textAlign: 'center', paddingTop: '80px' }}>
                    <div className="spinner-border text-primary" role="status"></div>
                    <p style={{ marginTop: '12px', color: '#64748b' }}>Loading listings...</p>
                </div>
            ) : displayedJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '2.5rem', opacity: 0.35, marginBottom: '12px' }}>&#128269;</div>
                    <h4 style={{ color: '#64748b' }}>No listings found</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Try a different keyword or remove filters.</p>
                    {searchTerm && (
                        <button className="btn btn-outline-primary btn-sm" onClick={() => { setSearchTerm(''); setTypeFilter('ALL'); setPage(0); fetchJobs(true); }}>
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="row">
                        {displayedJobs.map(job => (
                            <div className="col-md-6 col-lg-4 mb-4" key={job.id}>
                                <JobCard job={job} />
                            </div>
                        ))}
                    </div>

                    {!searchTerm && totalPages > 1 && (
                        <nav style={{ marginTop: '16px' }}>
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(p => p - 1)}>&#8249; Prev</button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(i)}>{i + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(p => p + 1)}>Next &#8250;</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
            )}
        </div>
    );
};
export default BrowseJobs;

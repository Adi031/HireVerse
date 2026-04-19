import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '', description: '', location: '', type: 'JOB', salary: '', deadline: '', categoryName: '', requiredSkills: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/${id}`);
                const job = response.data;
                setFormData({
                    title: job.title || '',
                    description: job.description || '',
                    location: job.location || '',
                    type: job.type || 'JOB',
                    salary: job.salary || '',
                    deadline: job.deadline ? job.deadline.substring(0, 10) : '',
                    categoryName: job.categoryName || '',
                    requiredSkills: job.requiredSkills ? job.requiredSkills.join(', ') : ''
                });
            } catch (err) {
                setError('Failed to load job details');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
        // Fetch categories for dropdown
        api.get('/jobs/categories').then(r => setCategories(r.data)).catch(() => {});
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        
        const payload = { ...formData };
        if (payload.salary === '') {
            payload.salary = null;
        } else {
            payload.salary = parseFloat(payload.salary);
        }

        if (payload.requiredSkills) {
            payload.requiredSkills = payload.requiredSkills.split(',').map(s => s.trim()).filter(s => s);
        } else {
            payload.requiredSkills = [];
        }

        try {
            await api.put(`/jobs/${id}`, payload);
            navigate('/recruiter/listings');
        } catch (err) {
            setError(err.response?.data || 'Failed to update job');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="mt-5 text-center">Loading...</div>;

    return (
        <div className="row mt-4">
            <div className="col-lg-8 mx-auto">
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h4 className="m-0">Edit Job/Internship</h4>
                    </div>
                    <div className="card-body p-4">
                        {error && <div className="alert alert-danger">{typeof error === 'object' ? JSON.stringify(error) : error}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Job Title</label>
                                <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Location (or Remote)</label>
                                    <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Category</label>
                                    <select name="categoryName" className="form-select" value={formData.categoryName} onChange={handleChange} required>
                                        <option value="">-- Select Category --</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Type</label>
                                    <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
                                        <option value="JOB">Job</option>
                                        <option value="INTERNSHIP">Internship</option>
                                    </select>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Salary (Optional)</label>
                                    <input type="number" name="salary" className="form-control" value={formData.salary} onChange={handleChange} />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Deadline</label>
                                    <input type="date" name="deadline" className="form-control" value={formData.deadline} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Required Skills (Comma separated)</label>
                                <input type="text" name="requiredSkills" className="form-control" placeholder="e.g. Java, Spring Boot, React" value={formData.requiredSkills} onChange={handleChange} />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Full Description</label>
                                <textarea name="description" className="form-control" rows="6" value={formData.description} onChange={handleChange} required></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                                {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</> : 'Update Listing'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditJob;

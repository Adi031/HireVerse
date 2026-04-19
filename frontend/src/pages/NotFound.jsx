import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="text-center mt-5">
            <h1 className="display-1 text-muted fw-bold">404</h1>
            <h3 className="mb-4">Page Not Found</h3>
            <p className="text-muted mb-4">The page you're looking for doesn't exist or has been moved.</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
    );
};

export default NotFound;

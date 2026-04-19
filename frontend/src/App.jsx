import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BrowseJobs from './pages/BrowseJobs';
import JobDetail from './pages/JobDetail';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Dashboards
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateProfile from './pages/candidate/CandidateProfile';
import MyApplications from './pages/candidate/MyApplications';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';
import PostJob from './pages/recruiter/PostJob';
import EditJob from './pages/recruiter/EditJob';
import MyListings from './pages/recruiter/MyListings';
import ViewApplicants from './pages/recruiter/ViewApplicants';
import CandidateView from './pages/recruiter/CandidateView';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageListings from './pages/admin/ManageListings';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== allowedRole) return <Navigate to="/login" />;
  return children;
};

// Redirects logged-in users to their dashboard; shows Home to guests
const SmartHome = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (user) {
    if (user.role === 'CANDIDATE') return <Navigate to="/candidate/dashboard" replace />;
    if (user.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  }
  return <Home />;
};

// Redirects already logged-in users away from login/register pages
const GuestOnly = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (user) {
    if (user.role === 'CANDIDATE') return <Navigate to="/candidate/dashboard" replace />;
    if (user.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container pb-5">
        <Routes>
          <Route path="/" element={<SmartHome />} />
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          
          {/* Candidate Routes */}
          <Route path="/candidate/dashboard" element={<ProtectedRoute allowedRole="CANDIDATE"><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/candidate/profile" element={<ProtectedRoute allowedRole="CANDIDATE"><CandidateProfile /></ProtectedRoute>} />
          <Route path="/candidate/applications" element={<ProtectedRoute allowedRole="CANDIDATE"><MyApplications /></ProtectedRoute>} />
          
          {/* Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRole="RECRUITER"><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/profile" element={<ProtectedRoute allowedRole="RECRUITER"><RecruiterProfile /></ProtectedRoute>} />
          <Route path="/recruiter/post-job" element={<ProtectedRoute allowedRole="RECRUITER"><PostJob /></ProtectedRoute>} />
          <Route path="/recruiter/edit-job/:id" element={<ProtectedRoute allowedRole="RECRUITER"><EditJob /></ProtectedRoute>} />
          <Route path="/recruiter/listings" element={<ProtectedRoute allowedRole="RECRUITER"><MyListings /></ProtectedRoute>} />
          <Route path="/recruiter/listings/:id/applicants" element={<ProtectedRoute allowedRole="RECRUITER"><ViewApplicants /></ProtectedRoute>} />
          <Route path="/recruiter/candidate/:id" element={<ProtectedRoute allowedRole="RECRUITER"><CandidateView /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/manage-listings" element={<ProtectedRoute allowedRole="ADMIN"><ManageListings /></ProtectedRoute>} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;

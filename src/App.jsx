import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/admin/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reviews from './pages/Reviews';
import Contacts from './pages/Contacts';
import Users from './pages/Users';
import UserTracker from './pages/UserTracker';
import AllServices from './services/AllServices';
import AddService from './services/AddService';
import EditService from './services/EditService';
import ContactButtons from './pages/ContactButtons';
import AllBlogs from './blogs/AllBlogs';
import AddBlog from './blogs/AddBlog';
import EditBlog from './blogs/EditBlog';
import WebsitePages from './pages/WebsitePages';
import WebsiteContent from './pages/WebsiteContent';
import Hiring from './pages/Hiring';
import { useAuth } from './context/AuthContext';
import NotFound from './pages/NotFound';
import SmtpSettings from './pages/SmtpSettings';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/" replace />;
}

function AdminEntry() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <Login />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminEntry />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<AllServices />} />
        <Route path="/services/add" element={<AddService />} />
        <Route path="/services/edit/:id" element={<EditService />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/users" element={<Users />} />
        <Route path="/user-tracker" element={<UserTracker />} />
        <Route path="/contact-buttons" element={<ContactButtons />} />
        <Route path="/smtp-settings" element={<SmtpSettings />} />
        <Route path="/blogs" element={<AllBlogs />} />
        <Route path="/blogs/add" element={<AddBlog />} />
        <Route path="/blogs/edit/:id" element={<EditBlog />} />
        <Route path="/website-pages" element={<WebsitePages />} />
        <Route path="/website-content" element={<WebsiteContent />} />
        <Route path="/hiring" element={<Hiring />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

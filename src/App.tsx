import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/common/Toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminHeader } from './components/layout/AdminHeader';
import { ScrollToTop } from './components/common/ScrollToTop';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminProjectEditPage } from './pages/admin/AdminProjectEditPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Layout wrapper for Public Website
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B10] text-slate-100 p-2 sm:p-4 md:p-6 transition-colors duration-300">
      <div className="flex-1 flex flex-col max-w-[1440px] w-full mx-auto space-y-4 sm:space-y-6">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

// Layout wrapper for Admin Dashboard
const AdminLayout: React.FC = () => {
  const { currentUser, users, loginAsUser, addNotification } = useApp();
  const ownerUser = users.find(u => u.role === 'Owner') || users[0];
  const isOwner = currentUser.role === 'Owner';
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const inviteId = searchParams.get('invite');
    if (inviteId) {
      const targetUser = users.find(u => u.id === inviteId);
      if (targetUser) {
        loginAsUser(targetUser.id);
        addNotification(`Welcome, ${targetUser.name}! Email invitation accepted. You now have access to manage and add applications.`, 'success');
        navigate('/admin', { replace: true });
      }
    }
  }, [location.search, users]);

  return (
    <div className="min-h-screen flex bg-[#0F0E11] text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <AdminHeader />
        {!isOwner && (
          <div className="bg-gradient-to-r from-amber-500/20 via-violet-500/20 to-amber-500/20 border-b border-amber-500/30 px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs z-30">
            <div className="flex items-center gap-2 text-amber-200">
              <span className="text-base">👑</span>
              <span>
                Active Session: <strong className="text-white font-mono">{currentUser.name}</strong> ({currentUser.role}). Studio Owner actions are restricted in this view.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (ownerUser) {
                  loginAsUser(ownerUser.id);
                  addNotification(`Switched back to Studio Owner (${ownerUser.name})`, 'info');
                }
              }}
              className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold uppercase tracking-wider text-[11px] shrink-0 shadow-lg cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>👑 Return to Studio Owner View</span>
            </button>
          </div>
        )}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Protected Route Guard for Admin
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const inviteId = searchParams.get('invite');

  // If entering via direct email invite link, grant admin authentication
  if (inviteId) {
    localStorage.setItem('verado_admin_auth', 'true');
  }

  const isAuth = localStorage.getItem('verado_admin_auth') === 'true';
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Dashboard Protected Layout */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="projects/new" element={<AdminProjectEditPage />} />
            <Route path="projects/:id/edit" element={<AdminProjectEditPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Action Toasts */}
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

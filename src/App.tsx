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
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { EmployeeSubmitProjectPage } from './pages/employee/EmployeeSubmitProjectPage';

// App-Specific Subdomain Pages
import { AppLandingPage } from './pages/app-subdomain/AppLandingPage';
import { AppPrivacyPolicyPage } from './pages/app-subdomain/AppPrivacyPolicyPage';
import { detectAppSubdomain } from './utils/subdomain';

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
  return (
    <div className="min-h-screen flex bg-[#0F0E11] text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <AdminHeader />
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

  // If entering via direct email invite link and not authenticated, route to activation login
  const isAuth = localStorage.getItem('verado_admin_auth') === 'true';
  if (inviteId && !isAuth) {
    return <Navigate to={`/admin/login?invite=${inviteId}`} replace />;
  }

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const activeSubdomain = detectAppSubdomain();

  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {activeSubdomain ? (
            /* Dedicated Subdomain Mode (e.g. shoecheck.verado.dev, foodai.verado.dev) */
            <>
              <Route path="/" element={<AppLandingPage appIdOverride={activeSubdomain.projectId} isSubdomainMode={true} />} />
              <Route path="/privacy" element={<AppPrivacyPolicyPage appIdOverride={activeSubdomain.projectId} isSubdomainMode={true} />} />
              <Route path="/terms" element={<AppPrivacyPolicyPage appIdOverride={activeSubdomain.projectId} isSubdomainMode={true} />} />
              <Route path="/support" element={<ContactPage />} />
              {/* Also allow direct app routes on subdomain if needed */}
              <Route path="/apps/:id" element={<AppLandingPage isSubdomainMode={false} />} />
              <Route path="/apps/:id/privacy" element={<AppPrivacyPolicyPage isSubdomainMode={false} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            /* Main Studio Domain (verado.com / showcase) */
            <>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Standalone App Subdomain Pages (Direct routes for testing and preview) */}
              <Route path="/apps/:id" element={<AppLandingPage isSubdomainMode={false} />} />
              <Route path="/apps/:id/privacy" element={<AppPrivacyPolicyPage isSubdomainMode={false} />} />
              <Route path="/privacy/:id" element={<AppPrivacyPolicyPage isSubdomainMode={false} />} />
              <Route path="/privacy" element={<AppPrivacyPolicyPage appIdOverride="shoecheck" isSubdomainMode={false} />} />

              {/* Dedicated Employee Project Submission Portal (No Admin Sidebar, Direct Landing) */}
              <Route path="/submit-project" element={<EmployeeSubmitProjectPage />} />
              <Route path="/contribute" element={<EmployeeSubmitProjectPage />} />

              {/* Admin Auth */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Admin Dashboard Protected Layout (Full Owner Access) */}
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
                <Route path="messages" element={<AdminMessagesPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>

        {/* Global Action Toasts */}
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

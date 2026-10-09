import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { BottomDock } from './components/BottomDock';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { DonateFoodPage } from './pages/DonateFoodPage';
import { NgoDashboard } from './pages/NgoDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { DonationTrackingPage } from './pages/DonationTrackingPage';
import { ImpactDashboard } from './pages/ImpactDashboard';
import { GovernmentDashboard } from './pages/GovernmentDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f7f0] text-emerald-900 font-bold text-sm">
        Verifying Security Credentials...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If unauthorized for this specific role, redirect to their role's home
    switch (user.role) {
      case 'DONOR': return <Navigate to="/donor/dashboard" replace />;
      case 'NGO': return <Navigate to="/ngo/dashboard" replace />;
      case 'VOLUNTEER': return <Navigate to="/volunteer/dashboard" replace />;
      case 'ADMIN': return <Navigate to="/admin/dashboard" replace />;
      default: return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#f3f7f0] text-slate-900 font-sans selection:bg-[#0f3825] selection:text-white pb-20">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/impact" element={<ImpactDashboard />} />
              <Route path="/government" element={<GovernmentDashboard />} />
              <Route path="/track/:code" element={<DonationTrackingPage />} />

              {/* Donor Routes */}
              <Route 
                path="/donor/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/donor/donate" 
                element={
                  <ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}>
                    <DonateFoodPage />
                  </ProtectedRoute>
                } 
              />

              {/* NGO Routes */}
              <Route 
                path="/ngo/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['NGO', 'ADMIN']}>
                    <NgoDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Volunteer Routes */}
              <Route 
                path="/volunteer/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['VOLUNTEER', 'ADMIN']}>
                    <VolunteerDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomDock />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

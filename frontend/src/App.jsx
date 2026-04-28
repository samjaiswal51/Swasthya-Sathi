import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AccountSettings from './pages/dashboards/patient/AccountSettings';
import DoctorSettings from './pages/dashboards/doctor/DoctorSettings';
import { useLocation } from 'react-router-dom';

const ThemeEnforcer = () => {
  const location = useLocation();
  React.useEffect(() => {
    const publicPaths = ['/', '/login', '/register'];
    if (publicPaths.includes(location.pathname) || location.pathname.startsWith('/emergency/')) {
      document.documentElement.classList.remove('theme-light', 'theme-dark', 'doctor-theme-light', 'doctor-theme-dark');
    }
  }, [location.pathname]);
  return null;
};

import Login from './pages/Login';
import Register from './pages/Register';
import WelcomePage from './pages/WelcomePage';

// Dashboards
import AdminDashboard from './pages/dashboards/AdminDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import FamilyDashboard from './pages/dashboards/FamilyDashboard';
import DoctorOverview from './pages/dashboards/doctor/DoctorOverview';
import DoctorOnboardingStepper from './pages/dashboards/doctor/DoctorOnboardingStepper';
import MyHealthPosts from './pages/health-tips/MyHealthPosts';
import CreateHealthTip from './pages/health-tips/CreateHealthTip';
import HealthTipDetail from './pages/health-tips/HealthTipDetail';
import PatientApprovalDashboard from './pages/update-requests/PatientApprovalDashboard';
import MyDoctors from './pages/dashboards/patient/MyDoctors';
import DoctorPatients from './pages/dashboards/doctor/DoctorPatients';
import RequestUpdateForm from './pages/update-requests/RequestUpdateForm';
import DoctorSentRequests from './pages/update-requests/DoctorSentRequests';
import DoctorProfile from './pages/dashboards/doctor/DoctorProfile';
import ManageAvailability from './pages/dashboards/doctor/ManageAvailability';
import DoctorAppointments from './pages/dashboards/doctor/DoctorAppointments';
import DoctorEarnings from './pages/dashboards/doctor/DoctorEarnings';
import DoctorStatistics from './pages/dashboards/doctor/DoctorStatistics';
import VerificationStatusPage from './pages/dashboards/doctor/VerificationStatusPage';

// Chat
import ChatPage from './pages/chat/ChatPage';

// Admin sub-pages
import AdminDashboardOverview from './pages/dashboards/admin/DashboardOverview';
import DoctorVerification from './pages/dashboards/admin/DoctorVerification';
import UserManagement from './pages/dashboards/admin/UserManagement';
import Analytics from './pages/dashboards/admin/Analytics';
import Complaints from './pages/dashboards/admin/Complaints';
import AdminPayments from './pages/dashboards/admin/AdminPayments';

// Patient Dashboard & its sub-pages
import PatientDashboard from './pages/dashboards/PatientDashboard';
import DashboardOverview from './pages/dashboards/patient/DashboardOverview';
import Profile from './pages/dashboards/patient/Profile';
import MedicalDocuments from './pages/dashboards/patient/MedicalDocuments';
import MedicationReminders from './pages/dashboards/patient/MedicationReminders';
import ReportAnalyzer from './pages/dashboards/patient/ReportAnalyzer';
import SwasthyaCard from './pages/dashboards/patient/SwasthyaCard';
import DoctorList from './pages/dashboards/patient/DoctorList';
import WellnessHub from './pages/dashboards/patient/WellnessHub';
import BookAppointment from './pages/dashboards/patient/BookAppointment';
import MyAppointments from './pages/dashboards/patient/MyAppointments';
import PaymentHistory from './pages/dashboards/patient/PaymentHistory';
import EmergencyScanPage from './pages/public/EmergencyScanPage';
import PlaceholderPage from './pages/dashboards/patient/PlaceholderPage';
import Notifications from './pages/dashboards/Notifications';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans">
          <ThemeEnforcer />
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/emergency/:token" element={<EmergencyScanPage />} />

            
            {/* Patient Dashboard with Nested Routes */}
            <Route 
              path="/patient-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            >
              {/* Default index route goes to Overview */}
              <Route index element={<DashboardOverview />} />
              
              {/* Nested Routes using the generic PlaceholderPage */}
              <Route path="profile" element={<Profile />} />
              <Route path="swasthya-card" element={<SwasthyaCard />} />
              <Route path="records" element={<MedicalDocuments />} />
              <Route path="analyzer" element={<ReportAnalyzer />} />
              <Route path="reminders" element={<MedicationReminders />} />
              <Route path="find-doctor" element={<DoctorList />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="wellness-hub" element={<WellnessHub />} />
              <Route path="health-tips/:id" element={<HealthTipDetail />} />
              <Route path="medical-updates" element={<PatientApprovalDashboard />} />
              <Route path="my-doctors" element={<MyDoctors />} />
              <Route path="appointments" element={<MyAppointments />} />
              <Route path="book-appointment/:doctorId" element={<BookAppointment />} />
              <Route path="payments" element={<PaymentHistory />} />
              <Route path="family" element={<PlaceholderPage title="Family Access" />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<AccountSettings />} />
            </Route>

            {/* Admin Dashboard with Nested Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardOverview />} />
              <Route path="verification" element={<DoctorVerification />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="settings" element={<AccountSettings />} />
            </Route>
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<DoctorOverview />} />
              <Route path="onboarding" element={<DoctorOnboardingStepper />} />
              <Route path="profile" element={<DoctorProfile />} />
              <Route path="verification" element={<VerificationStatusPage />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="request-update/:patientId" element={<RequestUpdateForm />} />
              <Route path="sent-requests" element={<DoctorSentRequests />} />
              <Route path="records" element={<PlaceholderPage title="Patient Medical Records" />} />
              <Route path="prescription" element={<PlaceholderPage title="Add Prescription" />} />
              <Route path="notes" element={<PlaceholderPage title="Consultation Notes" />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="schedule" element={<ManageAvailability />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="video" element={<PlaceholderPage title="Video Consultation" />} />
              <Route path="blogs" element={<MyHealthPosts />} />
              <Route path="blogs/create" element={<CreateHealthTip />} />
              <Route path="resources" element={<PlaceholderPage title="Upload Health Resources" />} />
              <Route path="earnings" element={<DoctorEarnings />} />
              <Route path="analytics" element={<DoctorStatistics />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<DoctorSettings />} />
            </Route>
            <Route 
              path="/family-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['family']}>
                  <FamilyDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch all for undefined routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

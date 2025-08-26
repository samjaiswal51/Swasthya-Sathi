import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/Auth';
import Register from './pages/Register';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FamilyDashboard from './pages/FamilyDashboard';

// PrivateRoute component to protect dashboards
const PrivateRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== requiredRole) {
    return <Navigate to={`/${user.role}-dashboard`} />;
  }

  return children;
};

function App() {
  const { user } = useAuth();

  // Is file mein <Router> ya <BrowserRouter> nahi hona chahiye
  return (
    <Routes>
      {/* Agar user logged in hai, toh use auth pages se uske dashboard par bhej do */}
      <Route path="/" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <AuthPage />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Register />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Login />} />

      {/* Private Dashboard Routes */}
      <Route
        path="/patient-dashboard"
        element={
          <PrivateRoute requiredRole="patient">
            <PatientDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/doctor-dashboard"
        element={
          <PrivateRoute requiredRole="doctor">
            <DoctorDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/family-dashboard"
        element={
          <PrivateRoute requiredRole="family">
            <FamilyDashboard />
          </PrivateRoute>
        }
      />

      {/* Agar koi aur URL daala jaaye, toh use home page par bhej do */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

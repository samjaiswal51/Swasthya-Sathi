// frontend/src/App.jsx

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';

// --- NEW: Import Firebase functions ---
import { requestForToken, onMessageListener } from './firebase';

// Import Pages and Components
import AuthPage from './pages/Auth';
import Register from './pages/Register';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FamilyDashboard from './pages/FamilyDashboard';
import DocumentViewer from './components/patient/DocumentViewer';

// --- NEW: Helper component to handle notification logic ---
const NotificationHandler = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Only request a token if a user is logged in
    if (user) {
      requestForToken();
      
      // Set up the listener for foreground messages
      onMessageListener()
        .then(payload => {
          console.log('Foreground message received:', payload);
        })
        .catch(err => console.log('Listener failed: ', err));
    }
  }, [user]); // Rerun this logic when the user logs in or out

  return null; // This component does not render any UI
};


// PrivateRoute component (No changes)
const PrivateRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== requiredRole) {
    // Redirect to the correct dashboard if roles don't match
    return <Navigate to={`/${user.role}-dashboard`} />;
  }

  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <>
      {/* ADDED: Toaster for displaying foreground notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* ADDED: The component that handles notification permissions */}
      <NotificationHandler />
      
      <Routes>
        {/* If user is logged in, redirect from auth pages to their dashboard */}
        <Route path="/" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <AuthPage />} />
        <Route path="/register" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Register />} />
        <Route path="/login" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Login />} />

        {/* Private Dashboard Routes (No changes) */}
        <Route
          path="/patient-dashboard"
          element={
            <PrivateRoute requiredRole="patient">
              <PatientDashboard />
            </PrivateRoute>
          }
        />
        
        {/* Document Viewer Route (No changes) */}
        <Route
          path="/patient-dashboard/document-viewer/:id"
          element={
            <PrivateRoute requiredRole="patient">
              <DocumentViewer />
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

        {/* Fallback route to redirect any unknown URL to the home page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
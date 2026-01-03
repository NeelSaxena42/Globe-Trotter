import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import MainLayout from './layouts/MainLayout';
import PublicItinerary from "./pages/PublicItinerary";


// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import TripDetails from './pages/TripDetails';
import AdminDashboard from './pages/AdminDashboard';
import PublicTrip from './pages/PublicTrip';
import Community from './pages/Community';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <AuthProvider>
          <TripProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/share/:tripId" element={<PublicTrip />} />
                <Route path="/" element={<MainLayout />}>
              <Route
                  path="/itinerary/public/:id"
                  element={<PublicItinerary />}
              />
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="create-trip" element={
                <ProtectedRoute>
                  <CreateTrip />
                </ProtectedRoute>
              } />
              <Route path="trips" element={
                <ProtectedRoute>
                  <MyTrips />
                </ProtectedRoute>
              } />
              <Route path="trips/:tripId/*" element={
                <ProtectedRoute>
                  <TripDetails />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="community" element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } />
              <Route path="community/:tripId" element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </TripProvider>
    </AuthProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
}

export default App;

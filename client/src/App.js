import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import FileUpload from './components/FileUpload';
import DashboardLayout from './components/DashboardLayout';
import UploadHistory from './components/UploadHistory';
import Profile from './components/Profile';
import AISummaries from './components/AISummaries';
import ElementIntegration from './components/ElementIntegration';


// Improved ProtectedRoute with redirect back
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  return token ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

function App() {
  const [excelData, setExcelData] = useState([]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Redirect /dashboard to /upload */}
        <Route path="/dashboard" element={<Navigate to="/upload" />} />

        {/* Protected Routes */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <FileUpload setExcelData={setExcelData} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-history"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <UploadHistory />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-summaries"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AISummaries data={excelData} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/element-integration"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ElementIntegration data={excelData} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

      {/* 404 Not Found */}
<Route
  path="*"
  element={
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you requested does not exist.</p>
    </div>
  }
/>
</Routes>
</Router>
);
}

export default App;

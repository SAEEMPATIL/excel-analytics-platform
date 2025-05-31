import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import FileUpload from './components/FileUpload';
import DashboardLayout from './components/DashboardLayout';
import UploadHistory from './components/UploadHistory';
import Insights from './components/Insights';
import Profile from './components/Profile';
import AISummaries from './components/AISummaries';

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
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

        {/* Protected Dashboard Routes */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                {/* Pass setExcelData to update excel data here */}
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
          path="/insights"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                {/* Pass excelData here for summaries */}
                <AISummaries data={excelData} />
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

        {/* 404 Route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        {isOpen && (
          <div className="sidebar-header">
            <h3>Dashboard</h3>
          </div>
        )}
        <ul>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/upload">File Upload</Link></li>
          <li><Link to="/upload-history">Upload History</Link></li>
          <li><Link to="/ai-summaries">AI Summaries</Link></li>
          <li><Link to="/element-integration">Element Integration</Link></li>
          <li><Link to="/insights">Insights</Link></li>
          <li><Link to="/login">Logout</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="topbar">
          <button className="toggle-button" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;

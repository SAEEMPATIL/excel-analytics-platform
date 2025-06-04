import React from 'react';

const Logout = ({ onLogout }) => {
  const handleLogoutClick = () => {
    const confirmed = window.confirm('Are you sure to logout?');
    if (confirmed) {
      // Call the logout function passed as prop
      if (onLogout) {
        onLogout();
      } else {
        // Default action - clear localStorage and reload
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <button
      onClick={handleLogoutClick}
      style={{
        padding: '8px 16px',
        backgroundColor: '#d9534f',
        border: 'none',
        borderRadius: 4,
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
      aria-label="Logout"
    >
      Logout
    </button>
  );
};

export default Logout;

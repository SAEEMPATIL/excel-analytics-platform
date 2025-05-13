import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to Excel Analytics Platform</h1>
      <button onClick={() => navigate('/login')}>Go to Login</button>
    </div>
  );
};

export default Home;

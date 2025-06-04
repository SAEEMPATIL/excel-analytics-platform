import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import bgImage from "../assets/homepage.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="home-container"
      style={{ 
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className="home-card">
        <h1><span>EXCEL ANALYTICS PLATFORM</span></h1>
        <h3> WELCOME!!</h3>
        <p>Analyze, visualize, and gain insights from your Excel data — easily and effectively.</p>
        <button onClick={() => navigate('/login')}>Get Started</button>
      </div>
    </div>
  );
};

export default Home;

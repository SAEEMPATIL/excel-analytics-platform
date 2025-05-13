import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
const handleLogin = (e) => {
  e.preventDefault();

  // Get stored users from localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Check if user exists
  const validUser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (validUser) {
    // Optionally save session
    localStorage.setItem('loggedInUser', JSON.stringify(validUser));

    navigate('/upload');
  } else {
    alert('Invalid credentials');
  }
};

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');       // your backend expects 'name'
  const [email, setEmail] = useState('');     // your backend expects 'email'
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');   // default role, can be hardcoded or selectable
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
        role
      });

      alert('Signup successful! You can now login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Choose password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {/* Optional: role selector */}
        {/* <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select> */}
        <button type="submit">Create Account</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
};

export default Signup;

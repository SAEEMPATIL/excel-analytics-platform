import React, { useEffect, useState } from 'react';
import './profile.css';

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(data => {
        const formattedUser = {
          ...data.user,
          dob: data.user.dob ? data.user.dob.slice(0, 10) : ''
        };
        setUser(data.user);
        setForm(formattedUser);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setUser(data.user);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="loading-message">Loading profile...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-heading">Profile</h2>

      {!editing ? (
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>DOB:</strong> {user.dob ? user.dob.slice(0, 10) : 'Not set'}</p>
          <p><strong>Place:</strong> {user.place || 'Not set'}</p>
          <p><strong>Phone:</strong> {user.phone || 'Not set'}</p>
          <p><strong>Designation:</strong> {user.designation || 'Not set'}</p>
          <button
            onClick={() => setEditing(true)}
            className="button-primary"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <input
            type="date"
            name="dob"
            value={form.dob || ''}
            onChange={handleChange}
          />
          <input
            name="place"
            placeholder="Place"
            value={form.place || ''}
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone || ''}
            onChange={handleChange}
          />
          <input
            name="designation"
            placeholder="Designation"
            value={form.designation || ''}
            onChange={handleChange}
          />

          <div className="profile-actions">
            <button type="submit" className="button-primary">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="button-secondary">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

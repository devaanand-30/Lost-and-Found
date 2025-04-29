import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for registration
  const handleRegisterClick = async () => {
    setLoading(true);
    setError('');  // Reset error message on each submit attempt

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);  // Correct endpoint for registration
      const { token, user } = res.data; // Receive token and user data after successful registration
      localStorage.setItem('token', token);  // Store the token in localStorage
      login(user); // Store user info globally via the auth context
      navigate('/');  // Redirect to home after successful registration and login
    } catch (err) {
      console.error('Registration error:', err);
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-sm mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Create an Account</h2>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="border p-2 w-full mb-3 rounded"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 w-full mb-3 rounded"
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password (min. 6 characters)"
        className="border p-2 w-full mb-4 rounded"
      />
      <button
        onClick={handleRegisterClick}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </div>
  );
};

export default Register;

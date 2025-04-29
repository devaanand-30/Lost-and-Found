import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); // Reset error message on form submit

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem('token', token);  // Save JWT token in localStorage
      login(user); // Set the user data in global auth context
      navigate('/'); // Redirect to home after successful login
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      setErrorMessage(msg); // Show error message from backend or default message
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <label className="block mb-2">
        <span className="text-sm">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 w-full"
          required
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm">Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 w-full"
          required
        />
      </label>

      {errorMessage && (
        <div className="text-red-500 mb-2">{errorMessage}</div>
      )}

      <button
        type="submit"
        className={`bg-blue-500 text-white px-4 py-2 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default Login;

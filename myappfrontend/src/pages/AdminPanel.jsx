// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Total Items</h2>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Verified</h2>
          <p className="text-2xl font-bold">{stats.verified}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Pending</h2>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Rejected</h2>
          <p className="text-2xl font-bold">{stats.rejected}</p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Manage Items
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;

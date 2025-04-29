// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/admin/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching items:', err);
      setLoading(false);
    }
  };

  const updateStatus = async (itemId, status) => {
    try {
      await axios.put(`/api/admin/items/${itemId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems(); // Refresh list
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`/api/admin/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading items...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item._id} className="border p-4 rounded shadow">
            <img src={item.imageUrl} alt="Item" className="w-full h-48 object-cover rounded mb-4" />
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p>{item.description}</p>
            <p><strong>Date:</strong> {item.date}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Status:</strong> <span className="font-medium">{item.status}</span></p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => updateStatus(item._id, 'verified')}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Verify
              </button>
              <button
                onClick={() => updateStatus(item._id, 'rejected')}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
              <button
                onClick={() => deleteItem(item._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

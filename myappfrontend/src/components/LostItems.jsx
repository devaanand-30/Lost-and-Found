// src/components/LostItems.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DownloadPdf from './DownloadPdf';

const LostItems = () => {
  const [lostItems, setLostItems] = useState([]);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const res = await axios.get('/api/items/lost');
        setLostItems(res.data);
      } catch (err) {
        console.error('Error fetching lost items:', err);
      }
    };

    fetchLostItems();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Lost Items</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {lostItems.length > 0 ? (
          lostItems.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded-lg shadow hover:shadow-md transition"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-700 mb-1">
                <strong>Description:</strong> {item.description}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-3">
                <strong>Location:</strong> {item.location}
              </p>

              {/* PDF Download */}
              <DownloadPdf item={item} />
            </div>
          ))
        ) : (
          <p className="text-gray-600">No lost items found.</p>
        )}
      </div>
    </div>
  );
};

export default LostItems;

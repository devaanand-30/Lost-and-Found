// src/pages/ItemDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`/api/items/${id}`);
        setItem(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Item not found or an error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading item details...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600 font-semibold">{error}</div>;
  }

  const { title, description, date, location, imageUrl } = item;
  const mapSrc = location
    ? `https://www.google.com/maps?q=${encodeURIComponent(location)}&z=15&output=embed`
    : '';

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}

      <p className="mb-2"><span className="font-semibold">Description:</span> {description}</p>
      <p className="mb-2"><span className="font-semibold">Date:</span> {new Date(date).toLocaleDateString()}</p>
      <p className="mb-4"><span className="font-semibold">Location:</span> {location}</p>

      {location && (
        <div className="h-64 rounded overflow-hidden">
          <iframe
            title="Item Location"
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;

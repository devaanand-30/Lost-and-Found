import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewItems = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          axios.get('/api/items/lost'),
          axios.get('/api/items/found'),
        ]);
        setLostItems(lostRes.data);
        setFoundItems(foundRes.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleViewDetails = (item) => {
    navigate(`/items/${item._id}`, { state: item });
  };

  const renderCard = (item, type) => (
    <div
      key={item._id}
      className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-50 transition"
      onClick={() => handleViewDetails(item)}
    >
      <h3 className="text-lg font-bold">{item.title}</h3>
      <p className="text-sm text-gray-600 mb-1">{item.description}</p>
      <p className="text-xs text-gray-500">Date: {new Date(item.date).toLocaleDateString()}</p>
      <p className="text-xs text-gray-500">Location: {item.location}</p>
      {item.imageUrl && (
        <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover mt-2 rounded" />
      )}
      <span className={`text-xs px-2 py-1 mt-2 inline-block rounded ${type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
        {type.toUpperCase()}
      </span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">All Lost & Found Items</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-red-600">Lost Items</h3>
          {lostItems.length > 0 ? (
            lostItems.map((item) => renderCard(item, 'lost'))
          ) : (
            <p className="text-gray-500">No lost items reported yet.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-green-600">Found Items</h3>
          {foundItems.length > 0 ? (
            foundItems.map((item) => renderCard(item, 'found'))
          ) : (
            <p className="text-gray-500">No found items reported yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewItems;

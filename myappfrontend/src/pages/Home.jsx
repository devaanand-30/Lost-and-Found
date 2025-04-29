import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';

const Home = () => {
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  const navigate = useNavigate();

  const handleMapClick = (latLng) => {
    setLocation({ lat: latLng.lat(), lng: latLng.lng() });
  };

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-8'>
      <div className='max-w-4xl mx-auto text-center'>
        <h1 className='text-4xl font-bold mb-4 text-blue-600'>
          Welcome to the Lost & Found Platform
        </h1>
        <p className='text-lg text-gray-600 mb-8'>
          Help others reconnect with their lost items by sharing information and locations.
        </p>
        <div className='space-x-4'>
          <button onClick={() => navigate('/lost')} className='bg-red-500 text-white px-4 py-2 rounded'>Report Lost Item</button>
          <button onClick={() => navigate('/found')} className='bg-green-500 text-white px-4 py-2 rounded'>Report Found Item</button>
        </div>
      </div>

      <div className='max-w-4xl mx-auto mt-10'>
        <h2 className='text-2xl font-semibold mb-4 text-center text-gray-800'>Share Lost Item Location</h2>
        <div className='rounded-lg overflow-hidden shadow-md'>
          <Map location={location} onClick={handleMapClick} />
        </div>
      </div>

      <div className='max-w-4xl mx-auto mt-10'>
        <h2 className='text-xl font-semibold mb-4 text-center text-gray-800'>Recently Reported Items</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-white p-4 rounded shadow'>
            <h3 className='font-semibold'>Wallet</h3>
            <p className='text-gray-600 text-sm'>Found near Central Park</p>
          </div>
          <div className='bg-white p-4 rounded shadow'>
            <h3 className='font-semibold'>Backpack</h3>
            <p className='text-gray-600 text-sm'>Lost at City Library</p>
          </div>
        </div>
      </div>

      <div className='max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-12'>
        <h2 className='text-xl font-semibold mb-4 text-gray-700'>Need to Contact Us?</h2>
        <p className='text-gray-600'>You can reach us at <a href='mailto:support@lostandfound.com' className='text-blue-500'>support@lostandfound.com</a>.</p>
      </div>

      <footer className='text-center text-gray-500 mt-10'>
        <p>&copy; {new Date().getFullYear()} Lost & Found. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Upload = ({ type = 'lost' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: null,
    email: '',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [geoError, setGeoError] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        setFormData(prev => ({ ...prev, location: coords }));
        setGeoError('');
      },
      () => setGeoError('Could not retrieve your location.')
    );
  };

  const handlePreview = () => {
    const msg = `Item ${type === 'found' ? 'found' : 'lost'}:\n\nTitle: ${formData.title}\nDescription: ${formData.description}\nLocation: ${formData.location}\nDate: ${formData.date}`;
    setPreviewMessage(msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.post(`/api/items/${type}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Send optional email
      if (formData.email) {
        await axios.post('/api/email/send', {
          to: formData.email,
          subject: `${type === 'found' ? 'Found' : 'Lost'} Item: ${formData.title}`,
          text: previewMessage || formData.description,
        });
      }

      setSuccessMsg('Item uploaded successfully!');
      setTimeout(() => navigate('/items'), 2000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Upload failed. Try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 capitalize">{type} Item Upload</h2>
      {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" type="text" value={formData.title} onChange={handleChange} placeholder="Title" className="border p-2 w-full" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="border p-2 w-full" required />
        <input name="date" type="date" value={formData.date} onChange={handleChange} className="border p-2 w-full" required />
        
        <div className="flex gap-2">
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="border p-2 w-full" required />
          <button type="button" onClick={handleLocation} className="bg-blue-500 text-white px-3 rounded">Use GPS</button>
        </div>
        {geoError && <p className="text-red-500 text-sm">{geoError}</p>}

        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Notify Owner (optional)" className="border p-2 w-full" />
        <input type="file" onChange={handleImageChange} className="w-full" accept="image/*" />

        <button type="button" onClick={handlePreview} className="bg-yellow-500 text-white px-3 py-1 rounded">Preview</button>
        {previewMessage && (
          <pre className="bg-gray-100 p-2 text-sm border rounded">{previewMessage}</pre>
        )}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default Upload;

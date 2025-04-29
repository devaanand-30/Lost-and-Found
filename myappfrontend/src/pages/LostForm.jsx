import React, { useState } from 'react';
import axios from '../utils/axios'; // Axios with base URL config
import { useNavigate } from 'react-router-dom';

const LostForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dateLost: '',
    location: '',
    image: null,
    ownerEmail: '',
  });

  const [previewMessage, setPreviewMessage] = useState('');
  const [geoError, setGeoError] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        setFormData((prev) => ({ ...prev, location: coords }));
        setGeoError('');
      },
      () => {
        setGeoError('Unable to retrieve your location');
      }
    );
  };

  const handlePreview = () => {
    const msg = `Someone reported a lost item:\n\nTitle: ${formData.name}\nDescription: ${formData.description}\nLocation: ${formData.location}\nDate: ${formData.dateLost}`;
    setPreviewMessage(msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      // ✅ Submit lost item
      await axios.post('/items/lost', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // ✅ Send email
      await axios.post('/api/email/send', {
        to: formData.ownerEmail,
        subject: `Lost Item Reported: ${formData.name}`,
        text: previewMessage || `Lost item reported: ${formData.description}`,
      });

      setMessageSent(true);
      setTimeout(() => navigate('/view-items'), 2000);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      setErrorMessage(`Failed to submit: ${errMsg}`);
      console.error('❌ Submit error:', errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Report Lost Item</h2>

      {messageSent && (
        <div className="text-green-600 text-center mb-2">
          Email sent successfully and item reported!
        </div>
      )}

      {errorMessage && (
        <div className="text-red-600 text-center mb-2">{errorMessage}</div>
      )}

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Title"
        className="border p-2 w-full mb-2"
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full mb-2"
        required
      />

      <input
        name="dateLost"
        type="date"
        value={formData.dateLost}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        required
      />

      <div className="flex gap-2 mb-2">
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="border p-2 w-full"
          required
        />
        <button
          type="button"
          onClick={handleLocation}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Use GPS
        </button>
      </div>

      {geoError && (
        <p className="text-red-500 text-sm mb-2">{geoError}</p>
      )}

      <input
        name="ownerEmail"
        type="email"
        value={formData.ownerEmail}
        onChange={handleChange}
        placeholder="Owner Email"
        className="border p-2 w-full mb-2"
        required
      />

      <input
        name="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-2"
      />

      {imagePreview && (
        <div className="mb-2">
          <p className="text-sm mb-1">Image Preview:</p>
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-60 object-contain rounded"
          />
        </div>
      )}

      <button
        type="button"
        onClick={handlePreview}
        className="bg-yellow-500 text-white px-4 py-2 rounded mb-2"
      >
        Preview Message
      </button>

      {previewMessage && (
        <div className="bg-gray-100 p-2 mb-4 text-sm border rounded whitespace-pre-wrap">
          {previewMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-red-500 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default LostForm;

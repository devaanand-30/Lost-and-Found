import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Map = ({ locations = [] }) => {
  // ✅ Hook must be called unconditionally
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey || '', // fallback to empty string
  });

  if (!apiKey) {
    return (
      <p className="text-red-500">
        Google Maps API key is missing. Please add <code>REACT_APP_GOOGLE_MAPS_API_KEY</code> to your <code>.env</code> file.
      </p>
    );
  }

  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={5}>
      {Array.isArray(locations) &&
        locations.map((loc, index) => {
          if (!loc || typeof loc !== 'string') return null;
          const [lat, lng] = loc.split(',').map(Number);
          if (isNaN(lat) || isNaN(lng)) return null;

          return <Marker key={index} position={{ lat, lng }} label={`${index + 1}`} />;
        })}
    </GoogleMap>
  );
};

export default Map;

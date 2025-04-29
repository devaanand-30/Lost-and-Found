import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LostForm from './pages/LostForm';
import FoundForm from './pages/FoundForm';
import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel';
import LostItems from './components/LostItems';
import FoundItems from './components/FoundItems';
import ViewItems from './pages/ViewItems';
import Upload from './pages/Upload';
import ItemDetails from './pages/ItemDetails';
import DownloadPdf from './components/DownloadPdf';
import Chat from './components/Chat';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './utils/auth';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ✅ Protected Routes for Authenticated Users */}
          <Route
            path="/lost"
            element={
              <ProtectedRoute>
                <LostForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/found"
            element={
              <ProtectedRoute>
                <FoundForm />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/lost-items" element={<LostItems />} />
          <Route path="/found-items" element={<FoundItems />} />
          <Route path="/view-items" element={<ViewItems />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/download" element={<DownloadPdf />} />
          <Route path="/chat" element={<Chat />} />

          {/* ✅ Protected Routes for Admin Only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute admin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute admin={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

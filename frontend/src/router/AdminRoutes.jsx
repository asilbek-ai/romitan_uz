import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// Admin Pages
import AdminDashboard from '../pages/AdminDashboard';
import AdminNews from '../pages/AdminNews';
import AdminServices from '../pages/AdminServices';
import AdminStatistics from '../pages/AdminStatistics';
import AdminOrganizations from '../pages/AdminOrganizations';
import AdminMedia from '../pages/AdminMedia';
import AdminCarousel from '../pages/AdminCarousel';
import AdminAudio from '../pages/AdminAudio';
import AdminDocuments from '../pages/AdminDocuments';
import AdminLeadership from '../pages/AdminLeadership';
import AdminFaq from '../pages/AdminFaq';
import AdminContacts from '../pages/AdminContacts';
import AdminSubscribers from '../pages/AdminSubscribers';
import AdminActivityLogs from '../pages/AdminActivityLogs';
import AdminUsers from '../pages/AdminUsers';
import AdminSettings from '../pages/AdminSettings';
import AdminLogin from '../pages/AdminLogin';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="statistics" element={<AdminStatistics />} />
          <Route path="organizations" element={<AdminOrganizations />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="carousel" element={<AdminCarousel />} />
          <Route path="audio" element={<AdminAudio />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="leadership" element={<AdminLeadership />} />
          <Route path="faq" element={<AdminFaq />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
          <Route path="activity-logs" element={<AdminActivityLogs />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}
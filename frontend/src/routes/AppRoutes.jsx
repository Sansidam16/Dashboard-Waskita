import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DatasetPage from '../pages/DatasetPage';
import DatasetCrawlPage from '../pages/DatasetCrawlPage';
import DatasetUploadPage from '../pages/DatasetUploadPage';
import DatasetSavedPage from '../pages/DatasetSavedPage';
import LabelingPage from '../pages/LabelingPage';
import DashboardSummary from '../components/DashboardSummary';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import AuthSwitch from './AuthSwitch';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<AuthSwitch />} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardSummary /></ProtectedRoute>} />
    <Route path="/dataset" element={<Navigate to="/dataset/crawl" />} />
    <Route path="/dataset/crawl" element={<ProtectedRoute><DatasetCrawlPage /></ProtectedRoute>} />
    <Route path="/dataset/upload" element={<ProtectedRoute><DatasetUploadPage /></ProtectedRoute>} />
    <Route path="/dataset/saved" element={<ProtectedRoute><DatasetSavedPage /></ProtectedRoute>} />
    <Route path="/labeling" element={<ProtectedRoute><LabelingPage /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/dashboard" />} />
  </Routes>
);

export default AppRoutes;

import React from 'react';
import DashboardSummary from '../components/DashboardSummary';
import LandingPage from '../pages/LandingPage';

export default function AuthSwitch() {
  const token = localStorage.getItem('token');
  if (token) {
    return <DashboardSummary />;
  }
  return <LandingPage />;
}

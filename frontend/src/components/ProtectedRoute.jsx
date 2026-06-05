import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../App';

export default function ProtectedRoute({ children }) {
  const { isAdmin } = useContext(AppContext);
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../store';

export default function Auth({ children }) {
  const auth = useAuth();
  if (!auth.checkToken) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // We use the hook to get global state

const ProtectedRoute = ({ children, allowedRole }) => {
  // We pull user and loading state from the Global Context Brain
  const { user, loading } = useAuth();

  // 1. Handle the "Wait" state
  // This prevents the "Flash of Login Page" while the app checks localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // 2. If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If the user is logged in but trying to access the wrong area
  // (e.g. A Worker trying to open the Customer Dashboard)
  if (allowedRole && user.role !== allowedRole) {
    // Smart redirect: send them to their own dashboard
    const target = user.role === 'worker' ? '/worker-dashboard' : '/user-dashboard';
    return <Navigate to={target} replace />;
  }

  // 4. Everything is valid, show the page
  return children;
};

export default ProtectedRoute;
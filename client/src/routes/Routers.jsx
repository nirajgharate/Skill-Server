import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import ServicesPage from "../pages/ServicesPage";
import ServiceDetailPage from "../pages/ServiceDetailPage";
import WorkerListingPage from "../pages/WorkerListingPage";
import WorkerDetailPage from "../pages/WorkerDetailPage";
import BookingForm from "../pages/BookingForm";
import ConfirmationPage from "../pages/ConfirmationPage";
import TrackingPage from "../pages/TrackingPage";
import MyBookingsDashboard from "../pages/MyBookingsDashboard";
import AuthGateway from "../pages/AuthGateway";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

// --- DASHBOARDS ---
import UserDashboard from "../pages/dashboard/UserDashboard";
import UserTransactions from "../pages/dashboard/UserTransactions";
import WorkerDashboard from "../pages/dashboard/WorkerDashboard";

// --- SECURITY ---
import ProtectedRoute from "../components/ProtectedRoute";
import ForgotPassword from "../pages/auth/ForgotPassword";

// --- TRACKING & SERVICES ---
import TrackService from "../pages/dashboard/TrackService";
import ErrorBoundary from "../components/ErrorBoundary";
import BookingSearch from "../pages/booking/BookingSearch";

import ProfilePage from "../pages/profile/ProfilePage";
import ProfilePageProfessional from "../pages/profile/ProfilePageProfessional";
import WorkerProfileEdit from "../pages/profile/WorkerProfileEdit";
import WorkerSchedule from "../pages/dashboard/WorkerSchedule";
import WorkerEarnings from "../pages/dashboard/WorkerEarnings";
import WorkerBookings from "../pages/dashboard/WorkerBookings";
import WorkerBookingDetails from "../pages/dashboard/WorkerBookingDetails";
import UserBookingDetails from "../pages/dashboard/UserBookingDetails";
import NotificationPage from "../pages/NotificationPage";

export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route path="/services/:id/workers" element={<WorkerListingPage />} />
      <Route path="/workers/:id" element={<WorkerDetailPage />} />
      {/* Transactional Flow */}
      <Route path="/booking" element={<BookingForm />} />
      {/* 🚀 THE FINAL DESTINATION */}
      <Route path="/confirmation" element={<ConfirmationPage />} />
      <Route path="/tracking" element={<TrackingPage />} />
      <Route path="/dashboard" element={<MyBookingsDashboard />} />
      <Route path="/a" element={<AuthGateway />} />
      {/* <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> */}
      {/* --- AUTHENTICATION ROUTES --- */}
      {/* This is the entry gate for choosing User or Worker */}
      {/* <Route path="/auth-gate" element={<RoleSelect />} /> */}
      {/* These pages dynamically detect the role from localStorage */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      // Inside your Routers function:
      <Route
        path="/track"
        element={
          <ProtectedRoute allowedRole="user">
            <ErrorBoundary>
              <TrackService />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
      {/* 🛡️ PROTECTED ROUTES (USER) */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute allowedRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute allowedRole="user">
            <UserTransactions />
          </ProtectedRoute>
        }
      />
      {/* 🛠️ PROTECTED ROUTES (WORKER) */}
      <Route
        path="/worker-dashboard"
        element={
          <ProtectedRoute allowedRole="worker">
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />
      {/* This is your Premium Profile Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRole="user">
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      {/* Worker Profile Edit */}
      <Route
        path="/worker/edit-profile"
        element={
          <ProtectedRoute allowedRole="worker">
            <WorkerProfileEdit />
          </ProtectedRoute>
        }
      />
      {/* Professional Unified Profile Pages */}
      <Route
        path="/user-profile"
        element={
          <ProtectedRoute allowedRole="user">
            <ProfilePageProfessional />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker-profile"
        element={
          <ProtectedRoute allowedRole="worker">
            <ProfilePageProfessional />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/schedule"
        element={
          <ProtectedRoute allowedRole="worker">
            <WorkerSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/earnings"
        element={
          <ProtectedRoute allowedRole="worker">
            <WorkerEarnings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/bookings"
        element={
          <ProtectedRoute allowedRole="worker">
            <WorkerBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/bookings/:bookingId"
        element={
          <ProtectedRoute allowedRole="worker">
            <WorkerBookingDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/bookings/:bookingId"
        element={
          <ProtectedRoute allowedRole="user">
            <UserBookingDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/book/searching" element={<BookingSearch />} />
    </Routes>
  );
}

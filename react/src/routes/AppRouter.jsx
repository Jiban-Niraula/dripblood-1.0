import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Login from "../auth/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/user/Users";
import MasterLayout from "../layouts/MasterLayout";

import BloodDonationEvent from "../pages/donation/BloodDonationEvent";
import MedicalReportsPage from "../pages/reports/MedicalReports";
import DonationRegistration from "../pages/donation/DonationRegistration";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route
          element={
            <ProtectedRoute>
              <MasterLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />

          {/* Blood Donation Camp */}
          <Route
            path="/donation-camps"
            element={<BloodDonationEvent />}
          />

          <Route
          path="/medical-reports"
          element={<MedicalReportsPage/>}
          >
          </Route>

          <Route
            path="/donation-registrations"
            element={<DonationRegistration />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import LandingPage from "./pages/landing/LandingPage";
import PatientForm from "./pages/landing/PatientForm";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/doctors/DoctorList";
import AdminNurses from "./pages/admin/nurses/NurseList";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminCasePapers from "./pages/admin/AdminCasePapers";
import AdminDepartments from "./pages/admin/AdminDepartments";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import NurseDashboard from "./pages/nurse/NurseDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminFollowUps from "./pages/admin/AdminFollowUps";
import NurseFollowUps from "./pages/nurse/NurseFollowUps";
import DoctorFollowUps from "./pages/doctor/DoctorFollowUps";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2e4a1e',
          colorInfo: '#2e4a1e',
          colorSuccess: '#16a34a',
          colorWarning: '#eab308',
          colorError: '#dc2626',
          colorBgBase: '#ffffff',
          colorTextBase: '#1e293b',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }
      }}
    >
      <BrowserRouter>
      <Routes>
        {/* Public Routes under PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/patient/register" element={<PatientForm />} />
        </Route>

        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Portals under DashboardLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Redirect base /dashboard to role-specific route handled by DashboardLayout/guards */}
          <Route index element={<Navigate to="/login" replace />} />
          
          {/* Admin Nested Routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/doctors"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/doctors/new"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/doctors/:id"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/doctors/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/nurses"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminNurses />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/nurses/new"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminNurses />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/nurses/:id"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminNurses />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/nurses/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminNurses />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/patients"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminPatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/appointments"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/casepapers"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminCasePapers />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/departments"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDepartments />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/reports"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/settings"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/follow-ups"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminFollowUps />
              </ProtectedRoute>
            }
          />

          <Route
            path="nurse"
            element={
              <ProtectedRoute allowedRoles={["Nurse"]}>
                <NurseDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="nurse/follow-ups"
            element={
              <ProtectedRoute allowedRoles={["Nurse"]}>
                <NurseFollowUps />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor"
            element={
              <ProtectedRoute allowedRoles={["Doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/follow-ups"
            element={
              <ProtectedRoute allowedRoles={["Doctor"]}>
                <DoctorFollowUps />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

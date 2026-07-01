import { BrowserRouter, Routes, Route } from "react-router-dom";

import PatientForm from "./pages/PatientForm";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Patient scans QR and opens this page */}
        <Route path="/" element={<PatientForm />} />

        {/* Doctor Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown URLs to Patient Form */}
        <Route path="*" element={<PatientForm />} />
      </Routes>
    </BrowserRouter>
  );
}
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

// PUBLIC
import Stores from "./pages/public/Stores";
import StorePage from "./pages/public/StorePage";

// SUPERADMIN

// OWNER
import OwnerLayout from "./pages/owner/OwnerLayout";
import OwnerHome from "./pages/owner/OwnerHome";
import OwnerStaffList from "./pages/owner/OwnerStaffList";
import OwnerSettings from "./pages/owner/OwnerSettings";
import SuperAdminHome from "./pages/SuperAdmin/SuperAdminHome";
import SuperAdminStoresList from "./pages/SuperAdmin/SuperAdminStoresList";
import SuperAdminLayout from "./pages/SuperAdmin/SuperAdminLayout";
import OwnerCreateStaff from "./pages/Owner/OwnerCreateStaff";
import CreateStore from "./pages/SuperAdmin/CreateStore";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ role, children }) {
  return localStorage.getItem("role") === role ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Stores />} />
        <Route path="/store/:slug" element={<StorePage />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* SUPERADMIN (dashboard layout) */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute>
              <RoleRoute role="SuperAdmin">
                <SuperAdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<SuperAdminHome />} />
          <Route path="stores/create" element={<CreateStore />} />
          <Route path="stores" element={<SuperAdminStoresList />} />
        </Route>

        {/* OWNER (dashboard layout) */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute>
              <RoleRoute role="Owner">
                <OwnerLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<OwnerHome />} />
          <Route path="staff/create" element={<OwnerCreateStaff/>} />
          <Route path="staff" element={<OwnerStaffList />} />
          <Route path="settings" element={<OwnerSettings />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

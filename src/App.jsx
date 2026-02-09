// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

// PUBLIC
import Stores from "./pages/public/Stores";
import StorePage from "./pages/public/StorePage";

// SUPERADMIN
import SuperAdminHome from "./pages/SuperAdmin/SuperAdminHome";
import SuperAdminStoresList from "./pages/SuperAdmin/SuperAdminStoresList";
import SuperAdminLayout from "./pages/SuperAdmin/SuperAdminLayout";
import CreateStore from "./pages/SuperAdmin/CreateStore";

// OWNER
import OwnerLayout from "./pages/owner/OwnerLayout";
import OwnerHome from "./pages/owner/OwnerHome";
import OwnerCreateStaff from "./pages/Owner/OwnerCreateStaff";
import OwnerStaffList from "./pages/Owner/OwnerStaffList";
import OwnerSettings from "./pages/Owner/OwnerSettings";

// MANAGER
import ManagerProducts from "./pages/manager/ManagerProducts";

// USER
import UserProfile from "./pages/user/UserProfile";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (storedRole !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Stores />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/store/:id" element={<StorePage />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* USER PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* MANAGER */}
        <Route
          path="/manager/products"
          element={
            <ProtectedRoute>
              <RoleRoute role="Manager">
                <ManagerProducts />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* SUPERADMIN */}
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

        {/* OWNER */}
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
          <Route path="staff/create" element={<OwnerCreateStaff />} />
          <Route path="staff" element={<OwnerStaffList />} />
          <Route path="settings" element={<OwnerSettings />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

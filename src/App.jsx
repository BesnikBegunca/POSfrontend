import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

// SuperAdmin
import CreateRestaurant from "./pages/SuperAdmin/CreateRestaurant";
import OwnerHome from "./pages/Owner/OwnerHome";
import OwnerCreateStaff from "./pages/Owner/OwnerCreateStaff";
import OwnerStaffList from "./pages/Owner/OwnerStaffList";
import OwnerSettings from "./pages/Owner/OwnerSettings";
import OwnerLayout from "./pages/Owner/OwnerLayout";
/* =======================
   AUTH GUARDS
======================= */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ role, children }) {
  const r = localStorage.getItem("role");
  return r === role ? children : <Navigate to="/login" replace />;
}

/* =======================
   APP
======================= */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* SUPERADMIN */}
        <Route
          path="/superadmin/create-restaurant"
          element={
            <ProtectedRoute>
              <RoleRoute role="SuperAdmin">
                <CreateRestaurant />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* OWNER DASHBOARD (NESTED) */}
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

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

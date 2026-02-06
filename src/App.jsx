import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRestaurant from "./pages/SuperAdmin/CreateRestaurant";
import OwnerStaff from "./pages/Owner/OwnerStaff";



function Dashboard() {
  return (
    <div style={{ padding: 24 }}>
      Logged in ✅ {localStorage.getItem("fullName")} ({localStorage.getItem("role")})
      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
       <Route path="/superadmin/create-restaurant" element={<CreateRestaurant />} />
        <Route path="/owner/staff" element={<OwnerStaff />} />


        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

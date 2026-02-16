// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// AUTH
import Login from "./pages/Login";
import Register from "./pages/Register";

// PUBLIC
import Stores from "./pages/public/Stores";
import StorePage from "./pages/public/StorePage";
import Collections from "./pages/public/Collections";
import NewPage from "./pages/public/NewPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";

// SUPERADMIN
import SuperAdminLayout from "./pages/SuperAdmin/SuperAdminLayout";
import SuperAdminHome from "./pages/SuperAdmin/SuperAdminHome";
import SuperAdminStoresList from "./pages/SuperAdmin/SuperAdminStoresList";
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
import CheckoutPage from "./pages/public/CheckoutPage";
import PaymentPage from "./pages/public/PaymentPage";
import OwnerPayments from "./pages/Owner/OwnerPayments";
import StripeCheckout from "./components/StripeCheckout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

/* ===========================
   ROUTE GUARDS
=========================== */

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (storedRole !== role) return <Navigate to="/" replace />;

  return children;
}

/* ===========================
   APP
=========================== */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Stores />} />
        <Route path="/stores" element={<Collections />} />
        <Route path="/products" element={<Collections />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/new" element={<NewPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/store/:id" element={<StorePage />} />
        <Route path="/checkout" element={<Elements stripe={stripePromise}><CheckoutPage /></Elements>} />
        <Route path="/payment" element={<Elements stripe={stripePromise}><PaymentPage /></Elements>} />
        <Route path="/stripe-checkout" element={<Elements stripe={stripePromise}><StripeCheckout /></Elements>} />


        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= USER ================= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* ================= MANAGER ================= */}
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

        {/* ================= SUPERADMIN ================= */}
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
          <Route path="stores" element={<SuperAdminStoresList />} />
          <Route path="stores/create" element={<CreateStore />} />
        </Route>

        {/* ================= OWNER ================= */}
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
          <Route path="payments" element={<OwnerPayments />} />
          <Route path="staff" element={<OwnerStaffList />} />
          <Route path="staff/create" element={<OwnerCreateStaff />} />
          

          <Route path="settings" element={<OwnerSettings />} />

        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

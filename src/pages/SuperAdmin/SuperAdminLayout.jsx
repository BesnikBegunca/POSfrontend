import { NavLink, Outlet, useNavigate } from "react-router-dom";

const palette = {
  bg: "#f3f4f6",
  surface: "#ffffff",
  surfaceSoft: "#fff7ed",
  border: "rgba(15,23,42,0.08)",
  text: "#0f172a",
  muted: "rgba(15,23,42,0.60)",
  accent: "#f59e0b",
  accentDeep: "#b45309",
};

function Item({ to, label }) {
  return (
    <NavLink
      to={to}
      end
      style={({ isActive }) => ({
        display: "block",
        padding: "10px 12px",
        borderRadius: 12,
        textDecoration: "none",
        color: isActive ? palette.text : "rgba(15,23,42,0.82)",
        background: isActive ? palette.surfaceSoft : "transparent",
        border: isActive
          ? `1px solid rgba(245,158,11,0.35)`
          : "1px solid transparent",
        fontWeight: 800,
        marginBottom: 6,
        boxShadow: isActive ? "0 10px 24px rgba(15,23,42,0.06)" : "none",
      })}
    >
      {label}
    </NavLink>
  );
}

export default function SuperAdminLayout() {
  const nav = useNavigate();
  const fullName = localStorage.getItem("fullName") || "SuperAdmin";
  const email = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #fff7ed 0%, #f3f4f6 55%, #eef2f7 100%)",
        color: palette.text,
        fontFamily: '"Manrope", "Segoe UI", Tahoma, sans-serif',
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 18,
          padding: 18,
          width: "100%",
          maxWidth: "100%",
          margin: 0,
        }}
      >
        <aside
          style={{
            borderRadius: 20,
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            padding: 14,
            position: "sticky",
            top: 18,
            height: "calc(100vh - 36px)",
            overflow: "auto",
            boxShadow: "0 20px 50px rgba(15,23,42,0.10)",
          }}
        >
          <div style={{ padding: 10, marginBottom: 12 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                color: palette.accentDeep,
              }}
            >
              SuperAdmin
            </div>
            <div style={{ opacity: 0.9, marginTop: 6, color: palette.text }}>
              <div style={{ fontWeight: 800 }}>{fullName}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{email}</div>
              <div
                style={{
                  marginTop: 8,
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "rgba(245,158,11,0.16)",
                  border: "1px solid rgba(245,158,11,0.28)",
                  fontSize: 12,
                  fontWeight: 800,
                  color: palette.accentDeep,
                }}
              >
                Role: {role}
              </div>
            </div>
          </div>

          <div style={{ padding: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 10 }}>
              MENU
            </div>

            <Item to="/superadmin" label="🏠 Dashboard" />
            <Item to="/superadmin/stores/create" label="➕ Create Store" />
            <Item to="/superadmin/stores" label="🏬 Stores List" />
          </div>

          <div style={{ padding: 10, marginTop: 14 }}>
            <button
              onClick={() => {
                localStorage.clear();
                nav("/login");
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(239,68,68,0.25)",
                background: "rgba(239,68,68,0.10)",
                color: "#b91c1c",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </aside>

        <main
          style={{
            borderRadius: 20,
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            padding: 18,
            minHeight: "calc(100vh - 36px)",
            boxShadow: "0 24px 60px rgba(15,23,42,0.10)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

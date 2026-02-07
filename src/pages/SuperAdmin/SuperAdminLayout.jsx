import { NavLink, Outlet, useNavigate } from "react-router-dom";

function Item({ to, label }) {
  return (
    <NavLink
      to={to}
      end
      style={({ isActive }) => ({
        display: "block",
        padding: "10px 12px",
        borderRadius: 10,
        textDecoration: "none",
        color: isActive ? "#0b1220" : "#e9eefb",
        background: isActive ? "#e9eefb" : "transparent",
        fontWeight: 700,
        marginBottom: 6,
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
        background: "linear-gradient(120deg, #070B12, #0B1220)",
        color: "#E9EEFB",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 18,
          padding: 18,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <aside
          style={{
            borderRadius: 18,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            padding: 14,
            position: "sticky",
            top: 18,
            height: "calc(100vh - 36px)",
            overflow: "auto",
          }}
        >
          <div style={{ padding: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>SuperAdmin</div>
            <div style={{ opacity: 0.9, marginTop: 6 }}>
              <div style={{ fontWeight: 800 }}>{fullName}</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>{email}</div>
              <div
                style={{
                  marginTop: 8,
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "rgba(233,238,251,0.14)",
                  border: "1px solid rgba(233,238,251,0.25)",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                Role: {role}
              </div>
            </div>
          </div>

          <div style={{ padding: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 10 }}>
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
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255, 60, 60, 0.15)",
                color: "#ffd5d5",
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
            borderRadius: 18,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            padding: 18,
            minHeight: "calc(100vh - 36px)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

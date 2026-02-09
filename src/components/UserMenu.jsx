import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserMenu() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const role = useMemo(() => localStorage.getItem("role") || "", []);
  const email = useMemo(() => localStorage.getItem("email") || "", []);
  const fullName = useMemo(() => localStorage.getItem("fullName") || "", []);

  const isLoggedIn = !!token;

  // close on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const initials = (fullName || email || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");

 const logout = () => {
  // fshi krejt variantat (për çdo rast)
  localStorage.removeItem("token");
  localStorage.removeItem("Token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("role");
  localStorage.removeItem("Role");
  localStorage.removeItem("email");
  localStorage.removeItem("Email");
  localStorage.removeItem("fullName");
  localStorage.removeItem("FullName");

  // nëse ke ruajt në sessionStorage
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("Token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("Role");

  // ndal auto-google selection (opsionale)
  if (window.google?.accounts?.id) {
    window.google.accounts.id.disableAutoSelect();
  }

  // ✅ hard refresh që UI me u rifresku 100%
  window.location.href = "/";
};


  const goDashboard = () => {
    setOpen(false);
    if (role === "SuperAdmin") return nav("/superadmin", { replace: true });
    if (role === "Owner") return nav("/owner", { replace: true });
    if (role === "Manager") return nav("/manager/products", { replace: true });
    return nav("/profile", { replace: true }); // User
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.authBtns}>
        <Link to="/login" style={{ ...styles.btn, ...styles.btnGhost }}>
          Login
        </Link>
        <Link to="/register" style={{ ...styles.btn, ...styles.btnPrimary }}>
          Register
        </Link>
      </div>
    );
  }

  return (
    <div ref={wrapRef} style={styles.wrap}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={styles.avatarBtn}
        aria-label="Open user menu"
      >
        <div style={styles.avatarCircle}>{initials || "U"}</div>
      </button>

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.cardTop}>
            <div style={styles.nameRow}>
              <div style={styles.name}>{fullName || "User"}</div>
              <div style={styles.rolePill}>{role || "User"}</div>
            </div>
            <div style={styles.email}>{email || "—"}</div>
          </div>

          <div style={styles.sep} />

          <button type="button" onClick={goDashboard} style={styles.itemBtn}>
            {role === "User" || !role ? "Profile & Settings" : "Go to dashboard"}
          </button>

          <div style={styles.sep} />

          <button type="button" onClick={logout} style={{ ...styles.itemBtn, ...styles.danger }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { position: "relative" },

  avatarBtn: {
    border: "1px solid rgba(226,232,240,.22)",
    background: "rgba(255,255,255,0.06)",
    borderRadius: 999,
    padding: 6,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: "rgba(255,255,255,0.92)",
    color: "#0b1220",
    fontWeight: 900,
    display: "grid",
    placeItems: "center",
    fontSize: 13,
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: 48,
    width: 280,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0b1220",
    color: "#e9eefb",
    boxShadow: "0 18px 50px rgba(0,0,0,.45)",
    overflow: "hidden",
    zIndex: 50,
  },

  cardTop: { padding: 12 },
  nameRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  name: { fontWeight: 900, fontSize: 14 },
  email: { opacity: 0.75, marginTop: 4, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis" },
  rolePill: {
    fontSize: 11,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  sep: { height: 1, background: "rgba(255,255,255,0.10)" },

  itemBtn: {
    width: "100%",
    textAlign: "left",
    padding: "12px 12px",
    border: "none",
    background: "transparent",
    color: "#e9eefb",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 13,
  },
  danger: { color: "#ffb6b6" },

  // same styles as your Stores navbar buttons (fallback if needed)
  authBtns: { display: "flex", gap: 10, alignItems: "center" },
  btn: {
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
    padding: "9px 14px",
    borderRadius: 12,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnGhost: {
    color: "#e2e8f0",
    border: "1px solid rgba(226,232,240,.25)",
    background: "transparent",
  },
  btnPrimary: {
    color: "#0b1220",
    background: "#ffffff",
    border: "1px solid rgba(255,255,255,.5)",
  },
};

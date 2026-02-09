import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function UserProfile() {
  const email = useMemo(() => localStorage.getItem("email") || "", []);
  const fullNameStored = useMemo(() => localStorage.getItem("fullName") || "", []);
  const role = useMemo(() => localStorage.getItem("role") || "User", []);
  const token = useMemo(() => localStorage.getItem("token"), []);

  const [fullName, setFullName] = useState(fullNameStored);
  const [msg, setMsg] = useState("");

  const initials = (fullName || email || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");

  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Not logged in</h2>
          <div style={{ opacity: 0.75 }}>Login first.</div>
          <Link to="/login" style={styles.btnPrimary}>Go to Login</Link>
        </div>
      </div>
    );
  }

  const saveLocal = (e) => {
    e.preventDefault();
    localStorage.setItem("fullName", fullName.trim());
    setMsg("Saved ✅ (local only)");
    setTimeout(() => setMsg(""), 1800);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.top}>
          <div style={styles.avatar}>{initials || "U"}</div>
          <div>
            <div style={styles.title}>Profile</div>
            <div style={styles.subtitle}>Logged in with Google / JWT</div>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Role</div>
          <div style={styles.value}>{role}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Email</div>
          <div style={styles.value}>{email || "—"}</div>
        </div>

        <form onSubmit={saveLocal} style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <div style={styles.label}>Full name (display)</div>
          <input
            style={styles.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
          />
          <button style={styles.btnPrimary}>Save</button>
          {msg && <div style={styles.success}>{msg}</div>}
          <div style={{ opacity: 0.65, fontSize: 12 }}>
            *Kjo ruhet vetëm në browser (localStorage). Nëse don, e bëjmë edhe në DB me endpoint.
          </div>
        </form>

        <Link to="/" style={styles.backLink}>← Back to stores</Link>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b1220",
    color: "#e9eefb",
    display: "grid",
    placeItems: "center",
    padding: 24,
    fontFamily: "Inter, system-ui, sans-serif",
  },
  card: {
    width: "min(560px, 100%)",
    borderRadius: 18,
    padding: 18,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  top: { display: "flex", gap: 12, alignItems: "center", marginBottom: 14 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    background: "rgba(255,255,255,0.92)",
    color: "#0b1220",
    fontWeight: 900,
    display: "grid",
    placeItems: "center",
  },
  title: { fontWeight: 900, fontSize: 18 },
  subtitle: { opacity: 0.7, fontSize: 12, marginTop: 2 },

  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 0",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  label: { opacity: 0.7, fontSize: 12, fontWeight: 800 },
  value: { fontWeight: 900, fontSize: 13 },

  input: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#e9eefb",
    outline: "none",
  },

  btnPrimary: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(233,238,251,0.92)",
    color: "#0b1220",
    fontWeight: 900,
    cursor: "pointer",
  },

  success: { color: "#b6ffcf", fontWeight: 900 },
  backLink: { display: "inline-block", marginTop: 14, color: "#cbd5f5", textDecoration: "none", fontWeight: 800 },
};

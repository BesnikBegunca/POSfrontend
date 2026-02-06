import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5083";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("fullName", res.data.fullName);
      localStorage.setItem("email", res.data.email);

      if (res.data.role === "SuperAdmin")
        window.location.href = "/superadmin/create-restaurant";
      else if (res.data.role === "Owner")
        window.location.href = "/owner";
      else window.location.href = "/owner";
    } catch (e2) {
      const data = e2?.response?.data;
      setErr(typeof data === "string" ? data : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* LEFT SIDE */}
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logo}>POS</div>
          <div>
            <h1 style={styles.h1}>Restaurant POS System</h1>
            <p style={styles.p}>
              Manage restaurants, staff, tables and sales from one place.
            </p>
          </div>
        </div>

        <ul style={styles.features}>
          <li>✔ SuperAdmin → Restaurants</li>
          <li>✔ Owner → Staff management</li>
          <li>✔ Admin → Operations</li>
          <li>✔ Secure JWT Authentication</li>
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <form onSubmit={onSubmit} style={styles.form}>
          <h2 style={{ margin: 0 }}>Login</h2>
          <p style={{ opacity: 0.8, marginTop: 6 }}>
            Enter your credentials to continue
          </p>

          <input
            style={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <div style={styles.error}>{err}</div>}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    background: "linear-gradient(120deg, #070B12, #0B1220)",
    color: "#E9EEFB",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  left: {
    padding: "80px 70px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 32,
  },
  brand: {
    display: "flex",
    gap: 18,
    alignItems: "center",
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    fontSize: 22,
    background: "#E9EEFB",
    color: "#0B1220",
  },
  h1: {
    margin: 0,
    fontSize: 36,
    fontWeight: 900,
  },
  p: {
    marginTop: 8,
    fontSize: 16,
    opacity: 0.85,
    maxWidth: 520,
  },
  features: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    fontSize: 16,
    opacity: 0.9,
    lineHeight: 1.9,
  },
  right: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(255,255,255,0.03)",
  },
  form: {
    width: "100%",
    maxWidth: 420,
    padding: 40,
    borderRadius: 22,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  input: {
    width: "100%",
    padding: "14px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#E9EEFB",
    marginTop: 14,
    fontSize: 15,
    outline: "none",
  },
  btn: {
    width: "100%",
    padding: 14,
    marginTop: 18,
    borderRadius: 14,
    border: "none",
    background: "#E9EEFB",
    color: "#0B1220",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    background: "rgba(255,60,60,0.15)",
    color: "#FFD5D5",
    fontWeight: 700,
  },
};

// src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5083";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("fullName", res.data.fullName);
      localStorage.setItem("email", res.data.email);

      // ✅ redirect sipas role
      if (res.data.role === "SuperAdmin") window.location.href = "/superadmin";
      else if (res.data.role === "Owner") window.location.href = "/owner";
      else window.location.href = "/"; // public

    } catch (e2) {
      const data = e2?.response?.data;
      setErr(typeof data === "string" ? data : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.viewport}>
      <section style={styles.left}>
        <div style={styles.brandRow}>
          <div style={styles.logo}>STORE</div>
          <div>
            <h1 style={styles.h1}>Marketplace Platform</h1>
            <p style={styles.p}>
              SuperAdmin creates stores & owners. Owners add products. Customers browse stores.
            </p>
          </div>
        </div>

        <ul style={styles.features}>
          <li>✔ SuperAdmin dashboard</li>
          <li>✔ Owner dashboard</li>
          <li>✔ Public stores page</li>
          <li>✔ Secure JWT</li>
        </ul>
      </section>

      <section style={styles.right}>
        <form onSubmit={submit} style={styles.form}>
          <h2 style={{ margin: 0 }}>Login</h2>
          <p style={{ marginTop: 6, opacity: 0.8 }}>
            Enter your credentials to continue
          </p>

          <input
            style={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {err && <div style={styles.error}>{err}</div>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </section>
    </div>
  );
}

const styles = {
  viewport: {
    width: "100vw",
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    background: "linear-gradient(120deg,#070b12,#0b1220)",
    color: "#e9eefb",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  left: {
    padding: "10vh 8vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 26,
  },
  brandRow: {
    display: "flex",
    gap: 16,
    alignItems: "center",
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    fontSize: 18,
    background: "#e9eefb",
    color: "#0b1220",
    letterSpacing: 0.6,
  },
  h1: { margin: 0, fontSize: 40, fontWeight: 900 },
  p: { marginTop: 10, fontSize: 16, opacity: 0.85, maxWidth: 560 },
  features: {
    margin: 0,
    paddingLeft: 18,
    fontSize: 16,
    lineHeight: 2,
    opacity: 0.9,
  },
  right: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.04)",
  },
  form: {
    width: "min(460px, 92%)",
    padding: 40,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 20,
  },
  input: {
    width: "100%",
    padding: 14,
    marginTop: 14,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "#e9eefb",
    outline: "none",
    fontSize: 15,
  },
  button: {
    width: "100%",
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "#e9eefb",
    color: "#070b12",
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 15,
  },
  error: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    background: "rgba(255,0,0,0.20)",
    color: "#ffd5d5",
    fontWeight: 700,
  },
};

// src/pages/Login.jsx
import { useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const API = "http://localhost:5083";

export default function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const storedRole = useMemo(() => localStorage.getItem("role"), []);
  const isLoggedIn = useMemo(() => !!localStorage.getItem("token"), []);

  const redirectByRole = (role) => {
    if (role === "SuperAdmin") return nav("/superadmin", { replace: true });
    if (role === "Owner") return nav("/owner", { replace: true });
    if (role === "Manager") return nav("/manager/products", { replace: true });
    return nav("/", { replace: true }); // User / public
  };

 const saveSession = (data) => {
  localStorage.setItem("token", data.token ?? data.Token ?? "");
  localStorage.setItem("role", data.role ?? data.Role ?? "");
  localStorage.setItem("email", data.email ?? data.Email ?? "");
  localStorage.setItem(
    "fullName",
    (data.fullName || data.name || data.FullName || data.Name) ?? ""
  );

  // ✅ SHTO KËTË:
  const sid =
  data.storeId ??
  data.StoreId ??
  data?.store?.id ??
  data?.Store?.Id ??
  data?.store?.Id ??
  null;

if (sid !== null && sid !== undefined) {
  localStorage.setItem("storeId", String(sid));
} else {
  localStorage.removeItem("storeId"); // optional, pastrim
}

};


  const showApiError = (e) => {
    console.error("AUTH ERROR:", e);
    const status = e?.response?.status;
    const data = e?.response?.data;
    setErr(
      `STATUS ${status}: ` +
        (typeof data === "string" ? data : JSON.stringify(data, null, 2))
    );
  };

  const onPasswordLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    const em = (email || "").trim().toLowerCase();
    if (!em || !password) return setErr("Email and password are required.");

    try {
      setLoading(true);
      const r = await axios.post(`${API}/api/auth/login`, {
        email: em,
        password,
      });

      // backend returns: { token, fullName, email, role } (or PascalCase)
      saveSession(r.data);

      setMsg("Logged in ✅");
      redirectByRole(r.data.role ?? r.data.Role);
    } catch (e2) {
      showApiError(e2);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (cred) => {
    setErr("");
    setMsg("");

    try {
      setLoading(true);

      // Google returns { credential: <id_token> }
      const idToken = cred?.credential;
      if (!idToken) return setErr("Google credential missing.");

      const r = await axios.post(`${API}/api/auth/google`, { idToken });

      saveSession(r.data);

      setMsg("Logged in with Google ✅");
      redirectByRole(r.data.role ?? r.data.Role);
    } catch (e2) {
      showApiError(e2);
    } finally {
      setLoading(false);
    }
  };

 const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("fullName");
  localStorage.removeItem("storeId"); // ✅
  nav("/login", { replace: true });
};


  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <div style={styles.logo}>MyStore</div>
          <div style={styles.subtitle}>Login to your account</div>
        </div>

        {isLoggedIn && (
          <div style={styles.loggedInBox}>
            <div style={{ fontWeight: 800 }}>
              You are already logged in as:{" "}
              <span style={{ opacity: 0.85 }}>{storedRole || "—"}</span>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button
                onClick={() => redirectByRole(storedRole)}
                style={styles.btnPrimary}
              >
                Go to dashboard
              </button>
              <button onClick={logout} style={styles.btnGhost}>
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Password login (admin/owner/manager) */}
        <form onSubmit={onPasswordLogin} style={{ display: "grid", gap: 10 }}>
          <input
            style={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button disabled={loading} style={styles.btnPrimary}>
            {loading ? "Loading…" : "Login"}
          </button>
        </form>

        <div style={styles.orRow}>
          <div style={styles.line} />
          <div style={styles.orText}>If you are a User</div>
          <div style={styles.line} />
        </div>

        {/* Google login (user i thjeshtë) */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={() => setErr("Google login failed")}
            useOneTap={false}
          />
        </div>

        {msg && <div style={styles.success}>{msg}</div>}
        {err && <pre style={styles.error}>{err}</pre>}

        <div style={styles.footer}>
          <Link to="/" style={styles.footerLink}>
            ← Back to stores
          </Link>
          <span style={{ opacity: 0.6 }}>|</span>
          <Link to="/register" style={styles.footerLink}>
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#0b1220",
    padding: 24,
    fontFamily: "Inter, system-ui, sans-serif",
  },
  card: {
    width: "min(440px, 100%)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 18,
    color: "#e9eefb",
  },
  brand: { textAlign: "center", marginBottom: 12 },
  logo: { fontWeight: 900, fontSize: 22, letterSpacing: 0.3 },
  subtitle: { opacity: 0.75, marginTop: 6, fontSize: 13 },

  loggedInBox: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },

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
  btnGhost: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "transparent",
    color: "#e9eefb",
    fontWeight: 900,
    cursor: "pointer",
  },

  orRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 10,
    margin: "14px 0",
    opacity: 0.75,
  },
  line: { height: 1, background: "rgba(255,255,255,0.18)" },
  orText: { fontSize: 12, fontWeight: 800 },

  success: { marginTop: 12, color: "#b6ffcf", fontWeight: 800 },
  error: {
    marginTop: 12,
    color: "#ffb6b6",
    fontWeight: 800,
    whiteSpace: "pre-wrap",
  },

  footer: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginTop: 14,
    fontSize: 13,
  },
  footerLink: { color: "#cbd5f5", textDecoration: "none", fontWeight: 700 },
};

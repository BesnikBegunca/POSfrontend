import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API = "http://localhost:5083";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #F6F6F2 0%, #EBEBE6 50%, #E8E8E4 100%)",
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#0F172A",
  },
  header: {
    background: "rgba(255,255,255,0.92)",
    borderBottom: "1px solid rgba(15,23,42,.08)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  headerInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 18px",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "#0F172A",
  },
  brandMark: {
    width: 26,
    height: 26,
    borderRadius: 10,
    background: "#F2D34B",
    boxShadow: "0 8px 20px rgba(242,211,75,.35)",
    display: "inline-block",
  },
  brandText: { fontWeight: 900, letterSpacing: 0.8, fontSize: 13 },
  backLink: {
    color: "rgba(15,23,42,.75)",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 13,
  },

  main: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 18px 64px",
    boxSizing: "border-box",
  },
  card: {
    width: "min(420px, 100%)",
    background: "#FFFFFF",
    borderRadius: 24,
    border: "1px solid rgba(15,23,42,.08)",
    boxShadow: "0 24px 56px rgba(15,23,42,.08)",
    padding: "40px 36px",
  },
  brandBlock: {
    textAlign: "center",
    marginBottom: 28,
  },
  logoRow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  logoBig: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: "#F2D34B",
    boxShadow: "0 12px 28px rgba(242,211,75,.4)",
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: 0.5,
    color: "#0B0F19",
  },
  subtitle: {
    margin: "6px 0 0",
    fontSize: 14,
    color: "rgba(15,23,42,.6)",
    fontWeight: 600,
  },

  form: { display: "flex", flexDirection: "column", gap: 18 },
  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(15,23,42,.85)",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,.12)",
    background: "#F8F8F6",
    fontSize: 15,
    color: "#0F172A",
    outline: "none",
    transition: "border-color .2s ease, box-shadow .2s ease",
  },
  inputFocus: {
    borderColor: "rgba(242,211,75,.5)",
    boxShadow: "0 0 0 3px rgba(242,211,75,.15)",
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,.12)",
    background: "#F8F8F6",
    fontSize: 15,
    color: "#0F172A",
    outline: "none",
    cursor: "pointer",
  },
  submitBtn: {
    marginTop: 8,
    padding: "16px 24px",
    borderRadius: 14,
    background: "#0B0F19",
    color: "#fff",
    border: "none",
    fontWeight: 900,
    fontSize: 15,
    cursor: "pointer",
    transition: "transform .15s ease, box-shadow .2s ease",
  },
  submitBtnDisabled: { opacity: 0.7, cursor: "not-allowed" },
  error: {
    marginTop: 4,
    padding: "12px 14px",
    borderRadius: 12,
    background: "rgba(239,68,68,.1)",
    border: "1px solid rgba(239,68,68,.25)",
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: 700,
  },
  success: {
    marginTop: 4,
    padding: "12px 14px",
    borderRadius: 12,
    background: "rgba(34,197,94,.1)",
    border: "1px solid rgba(34,197,94,.25)",
    color: "#15803D",
    fontSize: 13,
    fontWeight: 700,
  },
  footer: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 14,
    color: "rgba(15,23,42,.7)",
  },
  footerLink: {
    color: "#0B0F19",
    fontWeight: 800,
    textDecoration: "none",
  },
  footerSep: { margin: "0 10px", opacity: 0.5 },
};

function redirectByRole(nav, role) {
  if (role === "SuperAdmin") return nav("/superadmin", { replace: true });
  if (role === "Owner") return nav("/owner", { replace: true });
  if (role === "Manager") return nav("/manager/products", { replace: true });
  return nav("/", { replace: true });
}

export default function Register() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    const name = (fullName || "").trim();
    const em = (email || "").trim().toLowerCase();
    if (!name) return setErr("Full name is required.");
    if (!em) return setErr("Email is required.");
    if (!password) return setErr("Password is required.");
    if (password.length < 6) return setErr("Password must be at least 6 characters.");

    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/auth/register`, {
        fullName: name,
        email: em,
        password,
        role,
      });

      localStorage.setItem("token", res.data.token ?? res.data.Token ?? "");
      localStorage.setItem("role", res.data.role ?? res.data.Role ?? "");
      localStorage.setItem("email", res.data.email ?? res.data.Email ?? "");
      localStorage.setItem("fullName", res.data.fullName ?? res.data.FullName ?? "");

      setMsg("Account created successfully.");
      redirectByRole(nav, res.data.role ?? res.data.Role);
    } catch (e2) {
      const data = e2?.response?.data;
      setErr(typeof data === "string" ? data : (data?.message || data?.Message || "Registration failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <Link to="/" style={styles.brand}>
            <span style={styles.brandMark} />
            <span style={styles.brandText}>FASHION</span>
          </Link>
          <Link to="/" style={styles.backLink}>← Back to home</Link>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.brandBlock}>
            <div style={styles.logoRow}>
              <div style={styles.logoBig} />
              <span style={styles.title}>FASHION</span>
            </div>
            <p style={styles.subtitle}>Create your account</p>
          </div>

          <form onSubmit={onSubmit} style={styles.form}>
            <div>
              <label style={styles.label} htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
                autoComplete="name"
              />
            </div>
            <div>
              <label style={styles.label} htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                autoComplete="email"
              />
            </div>
            <div>
              <label style={styles.label} htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label style={styles.label} htmlFor="reg-role">Account type</label>
              <select
                id="reg-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={styles.select}
              >
                <option value="User">Customer (User)</option>
                <option value="Admin">Admin</option>
                <option value="Waiter">Waiter</option>
                <option value="Cashier">Cashier</option>
              </select>
            </div>

            {err && <div style={styles.error}>{String(err)}</div>}
            {msg && <div style={styles.success}>{msg}</div>}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(loading ? styles.submitBtnDisabled : {}),
              }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div style={styles.footer}>
            Already have an account?{" "}
            <Link to="/login" style={styles.footerLink}>Log in</Link>
            <span style={styles.footerSep}>·</span>
            <Link to="/" style={styles.footerLink}>Home</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

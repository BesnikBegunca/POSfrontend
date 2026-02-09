import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UserMenu from "../../components/UserMenu";

const API = "http://localhost:5083";

export default function Stores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/public/stores`).then((r) => setStores(r.data));
  }, []);

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <Link to="/" style={styles.logoLink}>
          <div style={styles.logo}>MyStore</div>
        </Link>

        <div style={styles.navRight}>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>
              Home
            </Link>
            <Link to="/stores" style={styles.navLink}>
              Stores
            </Link>
          </div>

          <div style={styles.authBtns}>
            <UserMenu/>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Choose a Store</h1>
        <p style={styles.heroSubtitle}>
          Browse available stores and start shopping
        </p>
      </section>

      {/* STORES GRID */}
      <section style={styles.container}>
        <div style={styles.grid}>
          {stores.map((s) => (
            <Link
              key={s.id}
              to={`/store/${s.id}`}
              style={{ textDecoration: "none" }}
            >
              <div style={styles.card} className="store-card">
                <div style={styles.cardTitle}>{s.name}</div>
                <div style={styles.cardSlug}>MAN{s.slug}</div>
                <div style={styles.cardAction}>Visit Store</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hover effect pa CSS file: inline onMouse */}
      <style>{`
        .store-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,.10);
        }
      `}</style>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  /* NAVBAR */
  navbar: {
    height: 64,
    padding: "0 32px",
    background: "#0f172a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },
  logoLink: { textDecoration: "none", color: "#fff" },
  logo: {
    fontWeight: 900,
    fontSize: 20,
    letterSpacing: 0.2,
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 18,
  },

  navLinks: {
    display: "flex",
    gap: 18,
    alignItems: "center",
  },
  navLink: {
    color: "#cbd5f5",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 14,
  },

  /* AUTH BUTTONS */
  authBtns: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  btn: {
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
    padding: "9px 14px",
    borderRadius: 12,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform .15s ease, opacity .15s ease",
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

  /* HERO */
  hero: {
    padding: "60px 24px 40px",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 900,
    marginBottom: 12,
    color: "#020617",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#475569",
  },

  /* CONTENT */
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px 60px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 24,
  },

  /* CARD */
  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,.06)",
    transition: "transform .25s ease, box-shadow .25s ease",
    cursor: "pointer",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#020617",
    marginBottom: 6,
  },
  cardSlug: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 16,
  },
  cardAction: {
    fontSize: 14,
    fontWeight: 700,
    color: "#2563eb",
  },
};

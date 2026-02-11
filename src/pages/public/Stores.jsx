import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UserMenu from "../../components/UserMenu";

const API = "http://localhost:5083";

// ✅ vendose nje foto te /public/hero.jpg
const HERO_BG = "/hero.jpg";

export default function Stores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/public/stores`).then((r) => setStores(r.data));
  }, []);

  return (
    <div style={styles.page}>
      {/* TOP STRIP (si ne foto) */}
      <div style={styles.topStrip}>
        <div style={styles.topStripInner}>
          <div style={styles.topLinks}>
            <span style={styles.topLink}>Best Sellers</span>
            <span style={styles.dot}>•</span>
            <span style={styles.topLink}>Gift Ideas</span>
            <span style={styles.dot}>•</span>
            <span style={styles.topLink}>New Releases</span>
            <span style={styles.dot}>•</span>
            <span style={styles.topLink}>Today’s Deals</span>
            <span style={styles.dot}>•</span>
            <span style={styles.topLink}>Customer Service</span>
          </div>

          <div style={styles.topRight}>
            <span style={styles.miniPill}>English</span>
            <span style={styles.miniPill}>Help</span>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navInner}>
          <Link to="/" style={styles.logoLink}>
            <div style={styles.logo}>MyStore</div>
          </Link>

          <div style={styles.navMid}>
            <button style={styles.burger} aria-label="Menu">
              <span style={styles.burgerLine} />
              <span style={styles.burgerLine} />
              <span style={styles.burgerLine} />
            </button>

            <select style={styles.categorySelect} defaultValue="all">
              <option value="all">All Category</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="home">Home</option>
            </select>

            <div style={styles.searchWrap}>
              <input style={styles.searchInput} placeholder="Search this store..." />
              <button style={styles.searchBtn} aria-label="Search">
                🔍
              </button>
            </div>
          </div>

          <div style={styles.navRight}>
            <div style={styles.navLinks}>
              <Link to="/" style={styles.navLink} className="nav-link">
                Home
              </Link>
              <Link to="/stores" style={styles.navLink} className="nav-link">
                Stores
              </Link>
            </div>

            <div style={styles.cartWrap}>
              <div style={styles.cartPill}>
                🛒 <span style={styles.cartText}>Cart</span>
                <span style={styles.cartBadge}>0</span>
              </div>
            </div>

            <div style={styles.userWrap}>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* HERO (si ne foto: background image + overlay + CTA) */}
      <header
        style={{
          ...styles.hero,
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.55)), url(${HERO_BG})`,
        }}
      >
        <div style={styles.heroInner}>
          <div style={styles.heroBrand}>MyStore</div>

          <div style={styles.heroTitle}>GET START</div>
          <div style={styles.heroTitle2}>YOUR FAVORITE SHOPPING</div>

          <div style={styles.heroActions}>
            <button style={styles.heroBtn}>BUY NOW</button>
          </div>
        </div>

        {/* down arrow circles (si slider vibe) */}
        <button style={{ ...styles.heroCircle, left: 18 }} aria-label="Prev">
          ‹
        </button>
        <button style={{ ...styles.heroCircle, right: 18 }} aria-label="Next">
          ›
        </button>
      </header>

      {/* STORES GRID */}
      <section style={styles.sectionTitleWrap}>
        <div style={styles.container}>
          <div style={styles.grid}>
            {stores.map((s) => {
              const imgPath = s.image ?? s.Image; // "/uploads/stores/xxx.jpg"
              const imgSrc = imgPath ? `${API}${imgPath}` : "/assets/logo/default-store.png";

              return (
                <Link key={s.id} to={`/store/${s.id}`} style={{ textDecoration: "none" }}>
                  <div style={styles.card} className="store-card">
                    <img
                      src={imgSrc}
                      alt={s.name}
                      style={styles.logoImg}
                      onError={(e) => {
                        e.currentTarget.onerror = null; // ✅ stop blink loop
                        e.currentTarget.src = "/assets/logo/default-store.png";
                      }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .store-card:hover{
          transform: translateY(-4px);
          box-shadow: 0 18px 50px rgba(0,0,0,.12);
          border-color: rgba(0,0,0,.10);
        }
        .store-card:active{
          transform: translateY(-2px);
        }
        .nav-link:hover{
          opacity:.95;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    fontFamily: "Inter, system-ui, sans-serif",
    overflow: "auto",
  },

  /* TOP STRIP */
  topStrip: {
    background: "#111827",
    color: "rgba(255,255,255,.85)",
    fontSize: 12,
  },
  topStripInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "10px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  topLinks: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  topLink: { cursor: "default", whiteSpace: "nowrap" },
  dot: { opacity: 0.5 },
  topRight: { display: "flex", gap: 8, alignItems: "center" },
  miniPill: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.10)",
    whiteSpace: "nowrap",
  },

  /* NAVBAR */
  navbar: {
    background: "#f59e0b",
    borderBottom: "1px solid rgba(0,0,0,.08)",
  },
  navInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  logoLink: { textDecoration: "none", color: "#fff" },
  logo: {
    fontWeight: 900,
    fontSize: 22,
    letterSpacing: 0.2,
    color: "#fff",
    textShadow: "0 2px 10px rgba(0,0,0,.15)",
    whiteSpace: "nowrap",
  },

  navMid: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
    justifyContent: "center",
    minWidth: 280,
  },

  burger: {
    width: 42,
    height: 40,
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,.12)",
    background: "rgba(255,255,255,.20)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  burgerLine: {
    display: "block",
    width: 18,
    height: 2,
    background: "rgba(17,24,39,.9)",
    borderRadius: 999,
    margin: 2,
  },

  categorySelect: {
    height: 40,
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,.12)",
    padding: "0 10px",
    background: "rgba(255,255,255,.92)",
    fontWeight: 700,
    fontSize: 13,
    outline: "none",
    minWidth: 140,
  },

  searchWrap: {
    display: "flex",
    alignItems: "center",
    height: 40,
    borderRadius: 10,
    overflow: "hidden",
    border: "1px solid rgba(0,0,0,.12)",
    background: "rgba(255,255,255,.92)",
    width: "min(520px, 100%)",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    border: "none",
    outline: "none",
    padding: "0 12px",
    fontSize: 13,
    background: "transparent",
  },
  searchBtn: {
    height: "100%",
    width: 44,
    border: "none",
    cursor: "pointer",
    background: "#ef4444",
    color: "#fff",
    fontSize: 14,
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  navLinks: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  navLink: {
    color: "rgba(17,24,39,.90)",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 13,
    padding: "6px 8px",
    borderRadius: 10,
    background: "rgba(255,255,255,.18)",
    border: "1px solid rgba(0,0,0,.10)",
    whiteSpace: "nowrap",
  },

  cartWrap: { display: "flex", alignItems: "center" },
  cartPill: {
    height: 40,
    padding: "0 12px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,.22)",
    border: "1px solid rgba(0,0,0,.12)",
    fontWeight: 900,
    color: "rgba(17,24,39,.92)",
    whiteSpace: "nowrap",
  },
  cartText: { fontSize: 13 },
  cartBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 999,
    background: "#111827",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontSize: 12,
    fontWeight: 900,
  },
  userWrap: { display: "flex", alignItems: "center" },

  /* HERO */
  hero: {
    height: 360,
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "grid",
    placeItems: "center",
  },
  heroInner: {
    textAlign: "center",
    color: "#fff",
    padding: "0 18px",
  },
  heroBrand: {
    fontWeight: 900,
    fontSize: 20,
    letterSpacing: 0.2,
    opacity: 0.95,
    marginBottom: 18,
    textShadow: "0 6px 18px rgba(0,0,0,.35)",
  },
  heroTitle: {
    fontWeight: 900,
    fontSize: 44,
    lineHeight: 1,
    textShadow: "0 10px 26px rgba(0,0,0,.35)",
  },
  heroTitle2: {
    marginTop: 10,
    fontWeight: 900,
    fontSize: 28,
    textShadow: "0 10px 26px rgba(0,0,0,.35)",
  },
  heroActions: { marginTop: 22 },
  heroBtn: {
    border: "none",
    cursor: "pointer",
    padding: "10px 18px",
    borderRadius: 10,
    background: "rgba(17,24,39,.92)",
    color: "#fff",
    fontWeight: 900,
    letterSpacing: 0.4,
    boxShadow: "0 14px 30px rgba(0,0,0,.25)",
  },
  heroCircle: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 42,
    height: 42,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.40)",
    background: "rgba(255,255,255,.15)",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontSize: 22,
    cursor: "pointer",
  },

  /* Section title wrap */
  sectionTitleWrap: {
    background: "#fff",
    borderBottom: "1px solid rgba(0,0,0,.06)",
  },

  /* GRID */
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "22px 18px 60px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 18,
  },

  /* CARD */
  card: {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,.06)",
    boxShadow: "0 10px 28px rgba(0,0,0,.06)",
    overflow: "hidden",
    transition: "transform .22s ease, box-shadow .22s ease, border-color .22s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    height: 180,
  },
  logoImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
};

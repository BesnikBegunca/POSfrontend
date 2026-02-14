import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UserMenu from "../../components/UserMenu";
import { useTheme, themes } from "../../context/ThemeContext";

const API = "http://localhost:5083";

// ✅ vendose nje foto te /public/hero.jpg (model / fashion photo)
const HERO_BG = "/hero.jpg";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const { theme, toggleTheme, isDark } = useTheme();
  const themePalette = themes[theme] || themes.light;
  const [q, setQ] = useState("");

  useEffect(() => {
    axios.get(`${API}/api/public/stores`).then((r) => setStores(r.data));
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return stores;
    return stores.filter((x) => (x.name ?? "").toLowerCase().includes(s));
  }, [stores, q]);

  return (
    <div
      style={{
        ...styles.page,
        background: themePalette.background,
        color: themePalette.text,
      }}
    >
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
      <nav
        style={{
          ...styles.navbar,
          background: isDark ? "#0f172a" : styles.navbar.background,
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,.08)"
            : styles.navbar.borderBottom,
        }}
      >
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
    <div style={styles.page}>
      {/* NAVBAR (white / clean) */}
      <header style={styles.header}>
        <div style={styles.container}>
          <div style={styles.nav}>
            <Link to="/" style={styles.brand}>
              <span style={styles.brandMark} />
              <span style={styles.brandText}>FASHION</span>
            </Link>

            <nav style={styles.navLinks}>
              <a href="#new" style={styles.navLink}>
                Collections
              </a>
              <a href="#new" style={styles.navLink}>
                New
              </a>
              <a href="#new" style={styles.navLink}>
                Featured
              </a>
              <a href="#new" style={styles.navLink}>
                Shop
              </a>
            </nav>

            <div style={styles.navRight}>
              <div style={styles.searchMini}>
                <span style={styles.searchIcon}>⌕</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search stores…"
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.actionRow}>
                <button style={styles.blackBtn}>Sign Up</button>
                <div style={styles.userWrap}>
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

          <div style={styles.navRight}>
            <div style={styles.navLinks}>
              <Link
                to="/"
                style={{
                  ...styles.navLink,
                  color: isDark
                    ? "rgba(248,250,252,.92)"
                    : styles.navLink.color,
                  background: isDark
                    ? "rgba(15,23,42,.45)"
                    : styles.navLink.background,
                  border: isDark
                    ? "1px solid rgba(255,255,255,.18)"
                    : styles.navLink.border,
                }}
                className="nav-link"
              >
                Home
              </Link>
              <Link
                to="/stores"
                style={{
                  ...styles.navLink,
                  color: isDark
                    ? "rgba(248,250,252,.92)"
                    : styles.navLink.color,
                  background: isDark
                    ? "rgba(15,23,42,.45)"
                    : styles.navLink.background,
                  border: isDark
                    ? "1px solid rgba(255,255,255,.18)"
                    : styles.navLink.border,
                }}
                className="nav-link"
              >
                Stores
              </Link>
            </div>

            <div style={styles.cartWrap}>
              <div
                style={{
                  ...styles.cartPill,
                  background: isDark
                    ? "rgba(255,255,255,.12)"
                    : styles.cartPill.background,
                  border: isDark
                    ? "1px solid rgba(255,255,255,.18)"
                    : styles.cartPill.border,
                  color: isDark
                    ? "rgba(248,250,252,.95)"
                    : styles.cartPill.color,
                }}
              >
                🛒 <span style={styles.cartText}>Cart</span>
                <span style={styles.cartBadge}>0</span>
      {/* HERO (si template: left text + right photo) */}
      <section style={styles.heroWrap}>
        <div style={styles.container}>
          <div style={styles.heroCard}>
            <div style={styles.heroGrid}>
              {/* LEFT */}
              <div style={styles.heroLeft}>
                <h1 style={styles.h1}>
                  LET’S
                  <br />
                  EXPLORE{" "}
                  <span style={styles.highlightWrap}>
                    <span style={styles.highlightBg} />
                    <span style={styles.highlightText}>UNIQUE</span>
                  </span>{" "}
                  <br />
                  CLOTHES.
                </h1>

                <p style={styles.heroP}>
                  Live for influential and innovative fashion. Explore stores and
                  discover what’s trending today.
                </p>

                <div style={styles.heroCtas}>
                  <Link to="/stores" style={styles.shopNowBtn}>
                    Shop Now
                  </Link>
                  <a href="#new" style={styles.ghostLink}>
                    View New Arrivals →
                  </a>
                </div>
              </div>

              {/* RIGHT */}
              <div style={styles.heroRight}>
                <div
                  style={{
                    ...styles.heroImg,
                    backgroundImage: `url(${HERO_BG})`,
                  }}
                  aria-label="Hero"
                />
                <div style={styles.heroSparkles} aria-hidden="true">
                  <span style={{ ...styles.sparkle, top: 26, left: 22 }} />
                  <span style={{ ...styles.sparkle, top: 72, right: 28 }} />
                  <span style={{ ...styles.sparkle, bottom: 36, left: 64 }} />
                  <span style={{ ...styles.sparkle, bottom: 18, right: 54 }} />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              style={{
                ...styles.themeToggle,
                background: isDark
                  ? "rgba(255,255,255,.12)"
                  : "rgba(17,24,39,.12)",
                color: isDark ? "#f8fafc" : "#111827",
                border: isDark
                  ? "1px solid rgba(255,255,255,.22)"
                  : "1px solid rgba(0,0,0,.12)",
              }}
              aria-label="Toggle theme"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </section>

      {/* BRANDS STRIP (yellow bar) */}
      <section style={styles.brandStrip}>
        <div style={styles.container}>
          <div style={styles.brandRow}>
            <span style={styles.brandLogo}>H&M</span>
            <span style={styles.brandLogo}>OBEY</span>
            <span style={styles.brandLogo}>shopify</span>
            <span style={styles.brandLogo}>LACOSTE</span>
            <span style={styles.brandLogo}>LEVI’S</span>
            <span style={styles.brandLogo}>amazon</span>
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

      {/* SECTION TITLE (si ne screenshot) */}
      <section
        style={{
          ...styles.sectionTitleWrap,
          background: themePalette.card,
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,.08)"
            : styles.sectionTitleWrap.borderBottom,
        }}
      >
        <div
          style={{
            ...styles.sectionTitle,
            color: themePalette.text,
          }}
        >
          Man &amp; Woman Fashion
        </div>
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
              <div
                style={{
                  ...styles.card,
                  background: themePalette.card,
                  border: isDark
                    ? "1px solid rgba(255,255,255,.08)"
                    : styles.card.border,
                  boxShadow: isDark
                    ? "0 10px 28px rgba(0,0,0,.22)"
                    : styles.card.boxShadow,
                }}
                className="store-card"
              >
                <img
                  src={`/assets/logo/${s.name.toLowerCase().replace(/[^a-z]/g, "")}.png`}
                  alt={s.name}
                  style={styles.logoImg}
                />
              </div>
            </Link>
          ))}
      </section>

      {/* NEW ARRIVALS */}
      <section id="new" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHead}>
            <h2 style={styles.h2}>NEW ARRIVALS</h2>
            <div style={styles.sectionMeta}>
              <span style={styles.countPill}>{filtered.length} stores</span>
            </div>
          </div>

          <div style={styles.grid}>
            {filtered.map((s) => {
              const imgPath = s.image ?? s.Image; // "/uploads/stores/xxx.jpg"
              const imgSrc = imgPath ? `${API}${imgPath}` : "/assets/logo/default-store.png";

              return (
                <Link key={s.id} to={`/store/${s.id}`} style={styles.cardLink}>
                  <article style={styles.card} className="arrival-card">
                    <div style={styles.cardImgWrap}>
                      <img
                        src={imgSrc}
                        alt={s.name}
                        style={styles.cardImg}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/assets/logo/default-store.png";
                        }}
                      />
                    </div>

                    <div style={styles.cardBody}>
                      <div style={styles.cardTitleRow}>
                        <h3 style={styles.cardTitle}>{s.name}</h3>
                        <span style={styles.cardTag}>Store</span>
                      </div>
                      <p style={styles.cardSub}>
                        Explore products, offers & new drops from <b>{s.name}</b>.
                      </p>
                      <div style={styles.cardFooter}>
                        <span style={styles.cardCta}>Shop now →</span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .arrival-card{
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        }
        .arrival-card:hover{
          transform: translateY(-6px);
          box-shadow: 0 22px 60px rgba(17,24,39,.10);
          border-color: rgba(17,24,39,.14);
        }
        .arrival-card:active{
          transform: translateY(-3px);
        }
        @media (max-width: 900px){
          .navLinksHideOnMobile{ display:none; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F6F6F2", // off-white si template
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
    color: "#0F172A",
  },

  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 18px",
  },

  /* Header / Nav */
  header: {
    background: "#FFFFFF",
    borderBottom: "1px solid rgba(15,23,42,.08)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  nav: {
    height: 76,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "#0F172A",
  },
  brandMark: {
    width: 28,
    height: 28,
    borderRadius: 10,
    background: "#F2D34B",
    boxShadow: "0 10px 22px rgba(242,211,75,.30)",
    display: "inline-block",
  },
  brandText: {
    fontWeight: 900,
    letterSpacing: 0.8,
    fontSize: 13,
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 22,
  },
  navLink: {
    textDecoration: "none",
    color: "rgba(15,23,42,.78)",
    fontWeight: 700,
    fontSize: 13,
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  searchMini: {
    height: 40,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 12px",
    borderRadius: 999,
    background: "#F7F7F4",
    border: "1px solid rgba(15,23,42,.08)",
    minWidth: 240,
  },
  searchIcon: { opacity: 0.55, fontWeight: 900 },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 13,
  },
  actionRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  blackBtn: {
    height: 40,
    padding: "0 16px",
    borderRadius: 12,
    background: "#0B0F19",
    color: "#fff",
    border: "1px solid rgba(0,0,0,.20)",
    fontWeight: 900,
    fontSize: 13,
    cursor: "pointer",
  },
  userWrap: { display: "flex", alignItems: "center" },
  themeToggle: {
    height: 36,
    padding: "0 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
    letterSpacing: 0.3,
  },

  /* Hero */
  heroWrap: { padding: "22px 0 0" },
  heroCard: {
    background: "#FFFFFF",
    border: "1px solid rgba(15,23,42,.08)",
    borderRadius: 22,
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(15,23,42,.06)",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr .9fr",
    gap: 0,
    alignItems: "stretch",
  },
  heroLeft: {
    padding: "44px 42px",
  },
  h1: {
    margin: 0,
    fontWeight: 900,
    letterSpacing: -0.6,
    lineHeight: 1.02,
    fontSize: 52,
    color: "#0B0F19",
  },
  highlightWrap: {
    position: "relative",
    display: "inline-block",
    padding: "0 6px",
    margin: "0 2px",
  },
  highlightBg: {
    position: "absolute",
    inset: "55% -4px -8px -4px",
    background: "#F2D34B",
    borderRadius: 10,
    zIndex: 0,
  },
  highlightText: { position: "relative", zIndex: 1 },
  heroP: {
    margin: "18px 0 0",
    maxWidth: 520,
    color: "rgba(15,23,42,.70)",
    fontSize: 14,
    lineHeight: 1.65,
    fontWeight: 600,
  },
  heroCtas: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginTop: 22,
  },
  shopNowBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    padding: "0 18px",
    borderRadius: 12,
    background: "#0B0F19",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 13,
  },
  ghostLink: {
    color: "rgba(15,23,42,.72)",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 13,
  },
  heroRight: {
    position: "relative",
    padding: 18,
    background: "linear-gradient(180deg, #FFFFFF, #F7F7F2)",
  },
  heroImg: {
    width: "100%",
    height: "100%",
    minHeight: 320,
    borderRadius: 18,
    backgroundSize: "cover",
    backgroundPosition: "center",
    border: "1px solid rgba(15,23,42,.10)",
  },
  heroSparkles: { position: "absolute", inset: 0, pointerEvents: "none" },
  sparkle: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 999,
    background: "rgba(15,23,42,.10)",
    boxShadow: "0 10px 30px rgba(15,23,42,.10)",
  },

  /* Brands strip */
  brandStrip: {
    marginTop: 16,
    background: "#F2D34B",
    borderTop: "1px solid rgba(15,23,42,.10)",
    borderBottom: "1px solid rgba(15,23,42,.10)",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    padding: "16px 0",
    flexWrap: "wrap",
  },
  brandLogo: {
    fontWeight: 900,
    letterSpacing: 0.6,
    color: "rgba(15,23,42,.70)",
    fontSize: 13,
  },

  /* Section */
  section: { padding: "28px 0 70px" },
  sectionHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  h2: { margin: 0, fontWeight: 900, fontSize: 18, letterSpacing: 0.4 },
  sectionMeta: { display: "flex", gap: 10, alignItems: "center" },
  countPill: {
    padding: "8px 12px",
    borderRadius: 999,
    background: "#FFFFFF",
    border: "1px solid rgba(15,23,42,.10)",
    fontWeight: 900,
    fontSize: 12,
    color: "rgba(15,23,42,.78)",
  },

  /* Grid + cards (New Arrivals style) */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 18,
  },
  cardLink: { textDecoration: "none", color: "inherit" },
  card: {
    background: "#FFFFFF",
    borderRadius: 18,
    border: "1px solid rgba(15,23,42,.08)",
    overflow: "hidden",
  },
  cardImgWrap: {
    height: 240,
    background: "#F7F7F4",
    borderBottom: "1px solid rgba(15,23,42,.06)",
    display: "grid",
    placeItems: "center",
    padding: 14,
  },
  cardImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: 12,
  },
  cardBody: { padding: 16 },
  cardTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  cardTitle: {
    margin: 0,
    fontWeight: 900,
    fontSize: 14,
    color: "#0B0F19",
  },
  cardTag: {
    fontSize: 11,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(242,211,75,.35)",
    border: "1px solid rgba(242,211,75,.60)",
    color: "rgba(15,23,42,.78)",
    whiteSpace: "nowrap",
  },
  cardSub: {
    margin: "10px 0 0",
    color: "rgba(15,23,42,.70)",
    fontSize: 12.5,
    lineHeight: 1.55,
    fontWeight: 600,
  },
  cardFooter: { marginTop: 14, display: "flex", justifyContent: "flex-end" },
  cardCta: { fontWeight: 900, fontSize: 12.5, color: "#0B0F19" },
};

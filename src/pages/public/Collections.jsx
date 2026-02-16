import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import UserMenu from "../../components/UserMenu";

const API = "http://localhost:5083";

const QUICK_FILTERS = [
  { id: "all", label: "All" },
  { id: "fashion", label: "Fashion" },
  { id: "sport", label: "Sport" },
  { id: "accessories", label: "Accessories" },
];

export default function Collections() {
  const { pathname } = useLocation();
  const isProducts = pathname === "/products" || pathname === "/stores";

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    axios
      .get(`${API}/api/public/stores`)
      .then((r) => setStores(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return stores;
    return stores.filter((x) => (x.name ?? "").toLowerCase().includes(s));
  }, [stores, q]);

  return (
    <div style={styles.page} className="collections-page">
      {/* NAVBAR - i njëjtë me faqen kryesore */}
      <header style={styles.header} className="nav-enter">
        <div style={styles.container}>
          <div style={styles.nav}>
            <Link to="/" style={styles.brand}>
              <span style={styles.brandMark} />
              <span style={styles.brandText}>FASHION</span>
            </Link>

            <nav style={styles.navLinks}>
              <Link to="/" style={styles.navLink}>HOME</Link>
              <Link to="/about" style={styles.navLink}>ABOUT</Link>
              <Link to="/products" style={isProducts ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}>PRODUCTS</Link>
              <Link to="/contact" style={styles.navLink}>CONTACTS</Link>
            </nav>

            <div style={styles.navRight}>
              <div style={styles.searchMini}>
                <span style={styles.searchIcon}>⌕</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={isProducts ? "Search products…" : "Search collections…"}
                  style={styles.searchInput}
                />
              </div>
              <div style={styles.actionRow}>
                <Link to="/login" style={styles.ghostBtn}>Sign In</Link>
                <div style={styles.userWrap}>
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section style={styles.heroBanner} className="hero-collections">
        <div style={styles.heroOverlay} />
        <div style={styles.container}>
          <div style={styles.heroContent}>
            <p style={styles.heroLabel}>{isProducts ? "Our products" : "Our collections"}</p>
            <h1 style={styles.heroTitle}>
              Explore all <br />
              <span style={styles.heroHighlight}>{isProducts ? "products" : "stores"}</span>
            </h1>
            <p style={styles.heroSub}>
              {isProducts
                ? "Choose from our stores. Each store offers unique products and new deals."
                : "Choose from carefully curated collections. Each store offers unique products."}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div style={styles.breadWrap}>
        <div style={styles.container}>
          <Link to="/" style={styles.breadLink}>Home</Link>
          <span style={styles.breadSep}>/</span>
          <span style={styles.breadCurrent}>{isProducts ? "Products" : "Collections"}</span>
        </div>
      </div>

      {/* Quick filters */}
      <div style={styles.filtersWrap}>
        <div style={styles.container}>
          <div style={styles.filtersRow}>
            {QUICK_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                style={activeFilter === f.id ? styles.filterPillActive : styles.filterPill}
                className="filter-pill"
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <section style={styles.trustStrip}>
        <div style={styles.container}>
          <div style={styles.trustGrid}>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>🚚</span>
              <span style={styles.trustText}>Free shipping over €50</span>
            </div>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>↩️</span>
              <span style={styles.trustText}>30-day returns</span>
            </div>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>🛡️</span>
              <span style={styles.trustText}>Secure payment</span>
            </div>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>💬</span>
              <span style={styles.trustText}>24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid - me animacion stagger */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHead}>
            <h2 style={styles.h2}>{isProducts ? "All products" : "All collections"}</h2>
            <span style={styles.countPill}>{filtered.length} stores</span>
          </div>

          {loading ? (
            <div style={styles.loadingWrap}>
              <div style={styles.spinner} />
              <p style={styles.loadingText}>Loading…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.emptyWrap}>
              <div style={styles.emptyIcon}>🛍️</div>
              <h3 style={styles.emptyTitle}>No stores found</h3>
              <p style={styles.emptySub}>
                Try a different search or explore from the home page.
              </p>
              <Link to="/" style={styles.emptyBtn} className="empty-btn">Go to home</Link>
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map((s, i) => {
                const imgPath = s.image ?? s.Image;
                const imgSrc = imgPath ? `${API}${imgPath}` : "/assets/logo/default-store.png";
                return (
                  <Link
                    key={s.id}
                    to={`/store/${s.id}`}
                    style={styles.cardLink}
                    className="collection-card"
                    data-index={i}
                  >
                    <article style={styles.card}>
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
                        <div style={styles.cardOverlay} className="card-overlay">
                          <span style={styles.viewText}>View collection →</span>
                        </div>
                      </div>
                      <div style={styles.cardBody}>
                        <h3 style={styles.cardTitle}>{s.name}</h3>
                        <p style={styles.cardSub}>
                          Explore products and offers from <b>{s.name}</b>.
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Përse të na zgjidhni */}
      <section style={styles.whySection}>
        <div style={styles.container}>
          <h2 style={styles.whyTitle}>Why choose us</h2>
          <div style={styles.whyGrid}>
            <div style={styles.whyCard} className="why-card">
              <span style={styles.whyIcon}>✨</span>
              <h4 style={styles.whyCardTitle}>Curated collections</h4>
              <p style={styles.whyCardText}>
                The best stores in one place. Choose with ease.
              </p>
            </div>
            <div style={styles.whyCard} className="why-card">
              <span style={styles.whyIcon}>🏷️</span>
              <h4 style={styles.whyCardTitle}>Exclusive offers</h4>
              <p style={styles.whyCardText}>
                Get discounts and news delivered straight to your inbox.
              </p>
            </div>
            <div style={styles.whyCard} className="why-card">
              <span style={styles.whyIcon}>🔒</span>
              <h4 style={styles.whyCardTitle}>Secure shopping</h4>
              <p style={styles.whyCardText}>
                Protected payment and easy returns on every order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Newsletter para footer */}
      <section style={styles.ctaSection}>
        <div style={styles.container}>
          <div style={styles.ctaCard}>
            <h3 style={styles.ctaTitle}>Join the community</h3>
            <p style={styles.ctaSub}>
              Sign up for offers and news about new collections.
            </p>
            <Link to="/" style={styles.ctaBtn} className="cta-btn">Explore now</Link>
          </div>
        </div>
      </section>

      {/* Footer - i njëjtë koncept si faqja kryesore */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerGrid}>
            <div>
              <div style={styles.footerBrand}>
                <span style={styles.brandMark} />
                <span>FASHION</span>
              </div>
              <p style={styles.footerTagline}>
                Fashion and the latest trends. Explore our stores.
              </p>
            </div>
            <div>
              <h4 style={styles.footerHeading}>Browse</h4>
              <Link to="/" style={styles.footerLink}>HOME</Link>
              <Link to="/about" style={styles.footerLink}>ABOUT</Link>
              <Link to="/products" style={styles.footerLink}>PRODUCTS</Link>
              <Link to="/contact" style={styles.footerLink}>CONTACTS</Link>
            </div>
            <div>
              <h4 style={styles.footerHeading}>Help</h4>
              <a href="#contact" style={styles.footerLink}>Contact</a>
              <a href="#faq" style={styles.footerLink}>FAQ</a>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <span>© {new Date().getFullYear()} FASHION. All rights reserved.</span>
          </div>
        </div>
      </footer>

      <style>{`
        .collections-page .nav-enter {
          animation: fadeSlideDown 0.5s ease-out;
        }
        .collections-page .hero-collections {
          animation: fadeIn 0.7s ease-out;
        }
        .collection-card {
          animation: cardReveal 0.5s ease-out backwards;
        }
        .collection-card:nth-child(1) { animation-delay: 0.05s; }
        .collection-card:nth-child(2) { animation-delay: 0.1s; }
        .collection-card:nth-child(3) { animation-delay: 0.15s; }
        .collection-card:nth-child(4) { animation-delay: 0.2s; }
        .collection-card:nth-child(5) { animation-delay: 0.25s; }
        .collection-card:nth-child(6) { animation-delay: 0.3s; }
        .collection-card:nth-child(n+7) { animation-delay: 0.35s; }
        .collection-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 56px rgba(15,23,42,.12);
        }
        .collection-card:hover .card-overlay { opacity: 1; }
        .collection-card .cardImgWrap { position: relative; overflow: hidden; }
        .collections-page .filter-pill:hover { background: rgba(242,211,75,.15); border-color: rgba(242,211,75,.5); }
        .collections-page .empty-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(242,211,75,.35); }
        .collections-page .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(242,211,75,.4); }
        .collections-page .why-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(15,23,42,.08); }
        .collection-card .card-overlay {
          position: absolute; inset: 0;
          background: rgba(15,23,42,.45);
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F6F6F2",
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
    color: "#0F172A",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 18px",
  },
  header: {
    background: "#FFFFFF",
    borderBottom: "1px solid rgba(15,23,42,.08)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  nav: {
    height: 76,
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    width: "100%",
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "#0F172A",
    justifySelf: "start",
  },
  brandMark: {
    width: 28,
    height: 28,
    borderRadius: 10,
    background: "#F2D34B",
    boxShadow: "0 10px 22px rgba(242,211,75,.30)",
    display: "inline-block",
  },
  brandText: { fontWeight: 900, letterSpacing: 0.8, fontSize: 13 },
  navLinks: { display: "flex", alignItems: "center", gap: 22, justifySelf: "center" },
  navLink: {
    textDecoration: "none",
    color: "rgba(15,23,42,.78)",
    fontWeight: 700,
    fontSize: 13,
  },
  navLinkActive: {
    color: "#0B0F19",
    borderBottom: "2px solid #F2D34B",
    paddingBottom: 4,
  },
  navRight: { display: "flex", alignItems: "center", gap: 12, justifySelf: "end" },
  searchMini: {
    height: 40,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 12px",
    borderRadius: 999,
    background: "#F7F7F4",
    border: "1px solid rgba(15,23,42,.08)",
    minWidth: 220,
  },
  searchIcon: { opacity: 0.55, fontWeight: 900 },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 13,
  },
  actionRow: { display: "flex", alignItems: "center", gap: 10 },
  ghostBtn: {
    height: 40,
    padding: "0 16px",
    borderRadius: 12,
    background: "transparent",
    color: "#0B0F19",
    border: "1px solid rgba(15,23,42,.2)",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  },
  userWrap: { display: "flex", alignItems: "center" },

  heroBanner: {
    position: "relative",
    background: "linear-gradient(135deg, #1a1d24 0%, #2d3239 50%, #1e2228 100%)",
    padding: "72px 0",
    marginBottom: 0,
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(242,211,75,.12) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  heroContent: { position: "relative", zIndex: 1 },
  heroLabel: {
    margin: 0,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 2,
    color: "rgba(255,255,255,.6)",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(32px, 5vw, 48px)",
    fontWeight: 900,
    letterSpacing: -0.5,
    lineHeight: 1.1,
    color: "#fff",
  },
  heroHighlight: {
    color: "#F2D34B",
    position: "relative",
  },
  heroSub: {
    margin: "16px 0 0",
    fontSize: 16,
    color: "rgba(255,255,255,.75)",
    maxWidth: 480,
    lineHeight: 1.6,
  },

  breadWrap: {
    padding: "14px 0",
    background: "#fff",
    borderBottom: "1px solid rgba(15,23,42,.08)",
  },
  breadLink: { color: "rgba(15,23,42,.7)", textDecoration: "none", fontWeight: 600, fontSize: 13 },
  breadSep: { margin: "0 8px", opacity: 0.5, fontSize: 13 },
  breadCurrent: { fontWeight: 700, fontSize: 13, color: "#0B0F19" },

  filtersWrap: {
    padding: "18px 0",
    background: "#F8F8F6",
    borderBottom: "1px solid rgba(15,23,42,.06)",
  },
  filtersRow: { display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" },
  filterPill: {
    padding: "10px 18px",
    borderRadius: 999,
    border: "1px solid rgba(15,23,42,.12)",
    background: "#fff",
    color: "rgba(15,23,42,.8)",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    transition: "all .2s ease",
  },
  filterPillActive: {
    padding: "10px 18px",
    borderRadius: 999,
    border: "1px solid #F2D34B",
    background: "rgba(242,211,75,.25)",
    color: "#0B0F19",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    transition: "all .2s ease",
  },

  trustStrip: {
    padding: "20px 0",
    background: "#FFFFFF",
    borderBottom: "1px solid rgba(15,23,42,.06)",
  },
  trustGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  trustIcon: { fontSize: 20 },
  trustText: { fontSize: 13, fontWeight: 700, color: "rgba(15,23,42,.8)" },

  section: { padding: "36px 0 60px" },
  sectionHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  h2: { margin: 0, fontWeight: 900, fontSize: 20, letterSpacing: 0.2 },
  countPill: {
    padding: "8px 14px",
    borderRadius: 999,
    background: "#FFFFFF",
    border: "1px solid rgba(15,23,42,.10)",
    fontWeight: 900,
    fontSize: 12,
    color: "rgba(15,23,42,.78)",
  },

  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: 16,
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid rgba(15,23,42,.12)",
    borderTopColor: "#F2D34B",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { margin: 0, fontSize: 14, color: "rgba(15,23,42,.7)", fontWeight: 600 },

  emptyWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 24px",
    textAlign: "center",
    background: "#FFFFFF",
    borderRadius: 20,
    border: "1px solid rgba(15,23,42,.08)",
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { margin: 0, fontSize: 22, fontWeight: 900, color: "#0B0F19" },
  emptySub: { margin: "10px 0 20px", fontSize: 15, color: "rgba(15,23,42,.7)", maxWidth: 320 },
  emptyBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "12px 24px",
    borderRadius: 12,
    background: "#F2D34B",
    color: "#0B0F19",
    fontWeight: 800,
    fontSize: 14,
    textDecoration: "none",
    transition: "transform .15s ease, box-shadow .2s ease",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 22,
  },
  cardLink: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: 20,
    border: "1px solid rgba(15,23,42,.08)",
    overflow: "hidden",
    height: "100%",
  },
  cardImgWrap: {
    height: 260,
    background: "#F7F7F4",
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
  cardOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(15,23,42,.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.25s ease",
  },
  viewText: {
    color: "#fff",
    fontWeight: 900,
    fontSize: 14,
    padding: "10px 18px",
    borderRadius: 12,
    background: "rgba(255,255,255,.2)",
    border: "1px solid rgba(255,255,255,.3)",
  },
  cardBody: { padding: 18 },
  cardTitle: { margin: 0, fontWeight: 900, fontSize: 16, color: "#0B0F19" },
  cardSub: {
    margin: "8px 0 0",
    color: "rgba(15,23,42,.70)",
    fontSize: 13,
    lineHeight: 1.5,
    fontWeight: 600,
  },

  whySection: {
    padding: "48px 0 56px",
    background: "#FFFFFF",
    borderTop: "1px solid rgba(15,23,42,.06)",
  },
  whyTitle: {
    margin: "0 0 28px",
    fontSize: 22,
    fontWeight: 900,
    textAlign: "center",
    color: "#0B0F19",
  },
  whyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 24,
  },
  whyCard: {
    padding: "28px 22px",
    background: "#F8F8F6",
    borderRadius: 18,
    border: "1px solid rgba(15,23,42,.06)",
    textAlign: "center",
    transition: "transform .2s ease, box-shadow .2s ease",
  },
  whyIcon: { fontSize: 36, display: "block", marginBottom: 14 },
  whyCardTitle: { margin: 0, fontSize: 16, fontWeight: 900, color: "#0B0F19" },
  whyCardText: {
    margin: "10px 0 0",
    fontSize: 14,
    color: "rgba(15,23,42,.7)",
    lineHeight: 1.5,
    fontWeight: 500,
  },

  ctaSection: { padding: "40px 0 56px" },
  ctaCard: {
    background: "linear-gradient(135deg, #0B0F19 0%, #1a202c 100%)",
    borderRadius: 22,
    padding: "44px 40px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,.08)",
  },
  ctaTitle: { margin: 0, fontSize: 24, fontWeight: 900, color: "#fff" },
  ctaSub: { margin: "12px 0 22px", fontSize: 15, color: "rgba(255,255,255,.75)", maxWidth: 400, marginLeft: "auto", marginRight: "auto" },
  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "14px 28px",
    borderRadius: 14,
    background: "#F2D34B",
    color: "#0B0F19",
    fontWeight: 900,
    fontSize: 14,
    textDecoration: "none",
    transition: "transform .15s ease, box-shadow .2s ease",
  },

  footer: {
    background: "#0B0F19",
    color: "rgba(255,255,255,.85)",
    padding: "48px 0 24px",
    marginTop: "auto",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 32,
    marginBottom: 32,
  },
  footerBrand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 900,
    fontSize: 14,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  footerTagline: {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.6,
    opacity: 0.75,
    maxWidth: 260,
  },
  footerHeading: {
    margin: "0 0 12px",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  footerLink: {
    display: "block",
    color: "rgba(255,255,255,.75)",
    textDecoration: "none",
    fontSize: 13,
    marginBottom: 8,
    fontWeight: 600,
  },
  footerBottom: {
    paddingTop: 24,
    borderTop: "1px solid rgba(255,255,255,.1)",
    fontSize: 12,
    opacity: 0.7,
  },
};

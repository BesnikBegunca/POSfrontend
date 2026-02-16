import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UserMenu from "../../components/UserMenu";

const API = "http://localhost:5083";
const HERO_BG = "/assets/basketball-player-relaxing-court.jpg";

// Brande për marquee (duplikojmë për loop të vazhdueshëm)
const BRANDS = [
  "H&M", "OBEY", "LACOSTE", "LEVI'S", "ZARA", "NIKE", "ADIDAS", "PUMA",
  "GUCCI", "PRADA", "SHOPIFY", "AMAZON", "ASOS", "UNIQLO", "TOMMY", "CALVIN KLEIN",
  "BURBERRY", "VERSACE", "RALPH LAUREN", "DIESEL",
];

/* Ikona të vogla për header */
const Icon = {
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Cart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  ),
  Heart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  ),
  Globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
  ),
  ChevronDown: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
  ),
  Truck: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/></svg>
  ),
  Refresh: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Headphones: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
  ),
};

function getCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    return cart.reduce((s, x) => s + (x.qty || 0), 0);
  } catch {
    return 0;
  }
}

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [lang, setLang] = useState("EN");
  const [cartCount, setCartCount] = useState(getCartCount);

  useEffect(() => {
    axios.get(`${API}/api/public/stores`).then((r) => setStores(r.data));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCartCount(getCartCount()), 1500);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => stores, [stores]);

  return (
    <div style={styles.page} className="home-page">
      {/* TOP ANNOUNCEMENT BAR */}
      <div style={styles.topBar}>
        <div style={styles.container}>
          <p style={styles.topBarText}>
            🎉 Free shipping on orders over €50 • Easy 30-day returns • 24/7 support
          </p>
        </div>
      </div>

      {/* HEADER I AVANCUAR */}
      <header style={styles.header} className="header-enter">
        <div style={styles.container}>
          <div style={styles.nav}>
            <Link to="/" style={styles.brand}>
              <span style={styles.brandMark} />
              <span style={styles.brandText}>FASHION</span>
            </Link>

            <nav style={styles.navLinks} className="navLinksHideOnMobile">
              <Link to="/" style={styles.navLink}>HOME</Link>
              <Link to="/about" style={styles.navLink}>ABOUT</Link>
              <Link to="/products" style={styles.navLink}>PRODUCTS</Link>
              <Link to="/contact" style={styles.navLink}>CONTACTS</Link>
            </nav>

            <div style={styles.navRight}>
              <Link to="/products" style={styles.iconBtn} className="icon-btn-header" title="Wishlist (coming soon)">
                <Icon.Heart />
              </Link>
              <Link to="/checkout" style={styles.iconBtn} className="icon-btn-header" title="Cart">
                <Icon.Cart />
                {cartCount > 0 && <span style={styles.cartBadge}>{cartCount > 99 ? "99+" : cartCount}</span>}
              </Link>

              <div style={styles.langWrap}>
                <button type="button" style={styles.langBtn} onClick={() => setLang(lang === "EN" ? "SQ" : "EN")} title="Change language">
                  <Icon.Globe />
                  <span style={styles.langText}>{lang}</span>
                </button>
              </div>

              <div style={styles.actionRow}>
                <Link to="/register" style={styles.blackBtn}>Sign Up</Link>
                <div style={styles.userWrap}>
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HERO (si template: left text + right photo) */}
      <section style={styles.heroWrap} className="hero-enter">
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
                  <Link to="/products" style={styles.shopNowBtn}>
                    Shop Now
                  </Link>
                  <Link to="/new" style={styles.ghostLink}>View New Arrivals →</Link>
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
          </div>
        </div>
      </section>

      {/* BRANDS MARQUEE - lëvizje horizontale automatike */}
      <section style={styles.marqueeSection} className="brand-strip-enter">
        <div style={styles.marqueeWrap}>
          <div style={styles.marqueeTrack} className="marquee-track">
            {[...BRANDS, ...BRANDS, ...BRANDS].map((name, i) => (
              <span key={`${name}-${i}`} style={styles.marqueeItem}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR - shipping, returns, support, secure */}
      <section style={styles.statsBar}>
        <div style={styles.container}>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <span style={styles.statIcon}><Icon.Truck /></span>
              <div>
                <strong style={styles.statTitle}>Free shipping</strong>
                <span style={styles.statSub}>On orders over €50</span>
              </div>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statIcon}><Icon.Refresh /></span>
              <div>
                <strong style={styles.statTitle}>Easy returns</strong>
                <span style={styles.statSub}>30 days to return</span>
              </div>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statIcon}><Icon.Headphones /></span>
              <div>
                <strong style={styles.statTitle}>24/7 support</strong>
                <span style={styles.statSub}>We're here for you</span>
              </div>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statIcon}><Icon.Shield /></span>
              <div>
                <strong style={styles.statTitle}>Secure payment</strong>
                <span style={styles.statSub}>100% protected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section id="featured" style={styles.featuredSection}>
        <div style={styles.container}>
          <h2 style={styles.featuredTitle}>Featured</h2>
          <p style={styles.featuredSub}>Our most popular picks this month.</p>
          <div style={styles.featuredStrip}>
            {filtered.slice(0, 4).map((s, i) => {
              const imgPath = s.image ?? s.Image;
              const imgSrc = imgPath ? `${API}${imgPath}` : "/assets/logo/default-store.png";
              return (
                <Link key={s.id} to={`/store/${s.id}`} style={styles.featuredCard} className="featured-card-link">
                  <div style={styles.featuredImgWrap}>
                    <img
                      src={imgSrc}
                      alt={s.name}
                      style={styles.featuredImg}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/assets/logo/default-store.png";
                      }}
                    />
                  </div>
                  <span style={styles.featuredName}>{s.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section id="new" style={styles.section} className="section-enter">
        <div style={styles.container}>
          <div style={styles.sectionHead}>
            <h2 style={styles.h2}>NEW ARRIVALS</h2>
            <div style={styles.sectionMeta}>
              <span style={styles.countPill}>{filtered.length} stores</span>
            </div>
          </div>

          <div style={styles.grid}>
            {filtered.map((s, i) => {
              const imgPath = s.image ?? s.Image; // "/uploads/stores/xxx.jpg"
              const imgSrc = imgPath ? `${API}${imgPath}` : "/assets/logo/default-store.png";

              return (
                <Link key={s.id} to={`/store/${s.id}`} style={styles.cardLink} className="arrival-card-wrap">
                  <article style={styles.card} className="arrival-card" data-index={i}>
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

      {/* NEWSLETTER */}
      <section style={styles.newsletterSection}>
        <div style={styles.container}>
          <div style={styles.newsletterCard} className="newsletter-card">
            <div style={styles.newsletterContent}>
              <span style={styles.newsletterLabel}>Newsletter</span>
              <h3 style={styles.newsletterTitle}>Join us</h3>
              <p style={styles.newsletterSub}>
                Get exclusive offers and news about new collections. No spam.
              </p>
            </div>
            <form style={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <div style={styles.newsletterInputWrap}>
                <input
                  type="email"
                  placeholder="Your email address"
                  style={styles.newsletterInput}
                  className="newsletter-input"
                  aria-label="Email for newsletter"
                />
              </div>
              <button type="submit" style={styles.newsletterBtn} className="newsletter-btn">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerGrid}>
            <div>
              <div style={styles.footerBrand}>
                <span style={styles.brandMark} />
                <span>FASHION</span>
              </div>
              <p style={styles.footerTagline}>
                Fashion and the latest trends. Explore our stores and find what you love.
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
        .home-page .header-enter {
          animation: headerSlide 0.45s ease-out;
        }
        .home-page .hero-enter {
          animation: heroFadeUp 0.6s ease-out 0.1s backwards;
        }
        .home-page .brand-strip-enter {
          animation: fadeIn 0.5s ease-out 0.25s backwards;
        }
        .home-page .section-enter {
          animation: fadeIn 0.5s ease-out 0.2s backwards;
        }
        .icon-btn-header:hover { background: rgba(15,23,42,.06); color: #0B0F19; }
        .dropdown-item-link:hover { background: rgba(242,211,75,.15); }
        .featured-card-link:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(15,23,42,.08);
        }
        .arrival-card-wrap {
          animation: cardStagger 0.5s ease-out backwards;
        }
        .arrival-card-wrap:nth-child(1) { animation-delay: 0.15s; }
        .arrival-card-wrap:nth-child(2) { animation-delay: 0.2s; }
        .arrival-card-wrap:nth-child(3) { animation-delay: 0.25s; }
        .arrival-card-wrap:nth-child(4) { animation-delay: 0.3s; }
        .arrival-card-wrap:nth-child(5) { animation-delay: 0.35s; }
        .arrival-card-wrap:nth-child(6) { animation-delay: 0.4s; }
        .arrival-card-wrap:nth-child(n+7) { animation-delay: 0.45s; }
        .arrival-card{
          transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        }
        .arrival-card:hover{
          transform: translateY(-6px);
          box-shadow: 0 22px 60px rgba(17,24,39,.10);
          border-color: rgba(17,24,39,.14);
        }
        .arrival-card:active{
          transform: translateY(-3px);
        }
        @keyframes headerSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cardStagger {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .marquee-track {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          animation: marqueeScroll 28s linear infinite;
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .newsletter-card .newsletter-input:focus {
          border-color: #F2D34B;
          box-shadow: 0 0 0 3px rgba(242,211,75,.25);
        }
        .newsletter-card .newsletter-input::placeholder {
          color: rgba(15,23,42,.45);
        }
        .newsletter-card .newsletter-btn:hover {
          background: #1a2332;
          transform: translateY(-1px);
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

  /* Top announcement bar */
  topBar: {
    background: "#0B0F19",
    color: "rgba(255,255,255,.9)",
    padding: "10px 0",
    fontSize: 12,
    fontWeight: 700,
    textAlign: "center",
  },
  topBarText: { margin: 0 },

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
  dropdownWrap: { position: "relative" },
  navLinkBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "rgba(15,23,42,.78)",
    fontWeight: 700,
    fontSize: 13,
    padding: "6px 0",
  },
  chevron: { display: "inline-flex", opacity: 0.8 },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: 6,
    minWidth: 200,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,.1)",
    boxShadow: "0 12px 40px rgba(15,23,42,.12)",
    padding: "8px 0",
    zIndex: 60,
  },
  dropdownItem: {
    display: "block",
    padding: "10px 16px",
    color: "rgba(15,23,42,.85)",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 600,
  },
  navRight: { display: "flex", alignItems: "center", gap: 14, justifySelf: "end" },
  iconBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 999,
    color: "rgba(15,23,42,.8)",
    textDecoration: "none",
    position: "relative",
    transition: "background .2s ease, color .2s ease",
  },
  cartBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 999,
    background: "#0B0F19",
    color: "#fff",
    fontSize: 10,
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
  },
  langWrap: { display: "flex", alignItems: "center" },
  langBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(15,23,42,.12)",
    background: "#F7F7F4",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 800,
    color: "rgba(15,23,42,.8)",
  },
  langText: { letterSpacing: 0.5 },
  actionRow: { display: "flex", alignItems: "center", gap: 10 },
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
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  },
  userWrap: { display: "flex", alignItems: "center" },

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

  /* Marquee - brandet lëvizin horizontal */
  marqueeSection: {
    marginTop: 40,
    marginBottom: 40,
    background: "#F2D34B",
    borderTop: "1px solid rgba(15,23,42,.10)",
    borderBottom: "1px solid rgba(15,23,42,.10)",
    overflow: "hidden",
    padding: "20px 0",
  },
  marqueeWrap: { display: "flex", width: "100%", overflow: "hidden" },
  marqueeTrack: {
    display: "flex",
    alignItems: "center",
    gap: "2.5rem",
    flexShrink: 0,
    paddingRight: "2.5rem",
  },
  marqueeItem: {
    fontWeight: 900,
    letterSpacing: 0.6,
    color: "rgba(15,23,42,.75)",
    fontSize: 14,
    whiteSpace: "nowrap",
  },

  /* Stats bar */
  statsBar: {
    background: "#FFFFFF",
    borderBottom: "1px solid rgba(15,23,42,.06)",
    padding: "28px 0",
    marginTop: 0,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 24,
    alignItems: "center",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "rgba(242,211,75,.2)",
    border: "1px solid rgba(242,211,75,.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#0B0F19",
    flexShrink: 0,
  },
  statTitle: { display: "block", fontSize: 13, fontWeight: 800, color: "#0B0F19" },
  statSub: { display: "block", fontSize: 12, color: "rgba(15,23,42,.65)", fontWeight: 600, marginTop: 2 },

  /* Featured strip */
  featuredSection: { padding: "32px 0 24px" },
  featuredTitle: { margin: 0, fontWeight: 900, fontSize: 20, letterSpacing: 0.2 },
  featuredSub: { margin: "6px 0 16px", fontSize: 14, color: "rgba(15,23,42,.7)", fontWeight: 600 },
  featuredStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 16,
  },
  featuredCard: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    background: "#FFFFFF",
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,.08)",
    overflow: "hidden",
    padding: 12,
    transition: "transform .2s ease, box-shadow .2s ease",
  },
  featuredImgWrap: { height: 140, borderRadius: 12, background: "#F7F7F4", overflow: "hidden" },
  featuredImg: { width: "100%", height: "100%", objectFit: "cover" },
  featuredName: { display: "block", marginTop: 10, fontWeight: 800, fontSize: 13, color: "#0B0F19" },

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

  /* Newsletter */
  newsletterSection: {
    padding: "64px 0 56px",
  },
  newsletterCard: {
    background: "#FFFFFF",
    borderRadius: 24,
    padding: "48px 44px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 32,
    border: "1px solid rgba(15,23,42,.08)",
    boxShadow: "0 4px 24px rgba(15,23,42,.06)",
    maxWidth: 900,
    margin: "0 auto",
  },
  newsletterContent: { flex: "1 1 280px" },
  newsletterLabel: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.2,
    color: "#F2D34B",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  newsletterTitle: {
    margin: 0,
    fontSize: 26,
    fontWeight: 900,
    color: "#0B0F19",
    letterSpacing: -0.4,
    lineHeight: 1.2,
  },
  newsletterSub: {
    margin: "14px 0 0",
    fontSize: 15,
    color: "rgba(15,23,42,.7)",
    lineHeight: 1.6,
    maxWidth: 380,
    fontWeight: 500,
  },
  newsletterForm: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    flex: "1 1 320px",
    maxWidth: 400,
    alignItems: "stretch",
  },
  newsletterInputWrap: {
    flex: "1 1 220px",
    minWidth: 0,
  },
  newsletterInput: {
    width: "100%",
    height: 52,
    padding: "0 18px",
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,.12)",
    background: "#F8F8F6",
    color: "#0B0F19",
    fontSize: 15,
    outline: "none",
    transition: "border-color .2s ease, box-shadow .2s ease",
  },
  newsletterBtn: {
    height: 52,
    padding: "0 28px",
    borderRadius: 14,
    background: "#0B0F19",
    color: "#fff",
    border: "none",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background .2s ease, transform .15s ease",
  },

  /* Footer */
  footer: {
    background: "#0B0F19",
    color: "rgba(255,255,255,.85)",
    padding: "48px 0 24px",
    marginTop: 48,
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
    color: "#fff",
  },
  footerTagline: {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.6,
    opacity: 0.75,
    maxWidth: 280,
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

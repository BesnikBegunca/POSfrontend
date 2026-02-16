import { Link } from "react-router-dom";
import UserMenu from "../../components/UserMenu";

const styles = {
  page: { minHeight: "100vh", background: "#F6F6F2", fontFamily: "Inter, system-ui, sans-serif", color: "#0F172A" },
  container: { maxWidth: 1200, margin: "0 auto", padding: "0 18px" },
  containerNarrow: { maxWidth: 720, margin: "0 auto", padding: "0 18px" },
  header: { background: "#FFFFFF", borderBottom: "1px solid rgba(15,23,42,.08)", position: "sticky", top: 0, zIndex: 50 },
  nav: { height: 76, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", width: "100%" },
  brand: { display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#0F172A", justifySelf: "start" },
  brandMark: { width: 28, height: 28, borderRadius: 10, background: "#F2D34B", boxShadow: "0 10px 22px rgba(242,211,75,.3)", display: "inline-block" },
  brandText: { fontWeight: 900, letterSpacing: 0.8, fontSize: 13 },
  navLinks: { display: "flex", alignItems: "center", gap: 22, justifySelf: "center" },
  navLink: { textDecoration: "none", color: "rgba(15,23,42,.78)", fontWeight: 700, fontSize: 13 },
  navLinkActive: { color: "#0B0F19", borderBottom: "2px solid #F2D34B", paddingBottom: 4 },
  navRight: { display: "flex", alignItems: "center", gap: 12, justifySelf: "end" },
  userWrap: { display: "flex", alignItems: "center" },

  hero: { position: "relative", background: "linear-gradient(135deg, #1a1d24 0%, #2d3239 50%, #1e2228 100%)", padding: "64px 0" },
  heroOverlay: { position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(242,211,75,.12) 0%, transparent 50%)", pointerEvents: "none" },
  heroContent: { position: "relative", zIndex: 1, textAlign: "center" },
  heroLabel: { margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,.6)", textTransform: "uppercase" },
  heroTitle: { margin: "12px 0 0", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 900, color: "#fff", letterSpacing: -0.5 },
  heroHighlight: { color: "#F2D34B" },
  heroSub: { margin: "16px 0 0", fontSize: 17, color: "rgba(255,255,255,.78)", maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 },

  intro: { padding: "56px 0 48px", textAlign: "center" },
  introP: { margin: 0, fontSize: 18, color: "rgba(15,23,42,.8)", lineHeight: 1.75, maxWidth: 680, marginLeft: "auto", marginRight: "auto" },

  values: { padding: "40px 0 56px" },
  valuesTitle: { margin: "0 0 32px", fontSize: 24, fontWeight: 900, textAlign: "center", color: "#0B0F19" },
  valuesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 },
  valueCard: { background: "#FFFFFF", borderRadius: 20, padding: "28px 24px", border: "1px solid rgba(15,23,42,.08)", textAlign: "center" },
  valueIcon: { fontSize: 40, marginBottom: 14 },
  valueTitle: { margin: 0, fontSize: 17, fontWeight: 900, color: "#0B0F19" },
  valueText: { margin: "10px 0 0", fontSize: 14, color: "rgba(15,23,42,.7)", lineHeight: 1.55 },

  stats: { padding: "32px 0", background: "#F2D34B", borderTop: "1px solid rgba(15,23,42,.1)", borderBottom: "1px solid rgba(15,23,42,.1)" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 24, textAlign: "center" },
  statNum: { margin: 0, fontSize: 32, fontWeight: 900, color: "#0B0F19" },
  statLabel: { margin: "4px 0 0", fontSize: 13, fontWeight: 700, color: "rgba(15,23,42,.75)" },

  story: { padding: "56px 0 64px" },
  storyInner: { maxWidth: 640, margin: "0 auto", textAlign: "center" },
  storyTitle: { margin: 0, fontSize: 22, fontWeight: 900, color: "#0B0F19" },
  storyP: { margin: "16px 0 0", fontSize: 16, color: "rgba(15,23,42,.75)", lineHeight: 1.7 },

  cta: { padding: "0 0 64px", textAlign: "center" },
  ctaBtn: { display: "inline-flex", alignItems: "center", padding: "14px 28px", borderRadius: 14, background: "#0B0F19", color: "#fff", fontWeight: 900, fontSize: 14, textDecoration: "none" },

  footer: { background: "#0B0F19", color: "rgba(255,255,255,.85)", padding: "40px 0 24px" },
  footerGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 28, marginBottom: 28 },
  footerBrand: { display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 900, fontSize: 14, marginBottom: 8 },
  footerLink: { display: "block", color: "rgba(255,255,255,.75)", textDecoration: "none", fontSize: 13, marginBottom: 6, fontWeight: 600 },
  footerBottom: { paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.1)", fontSize: 12, opacity: 0.75 },
};

const VALUES = [
  { icon: "✨", title: "Quality", text: "We only work with stores that offer verified, safe products for buyers." },
  { icon: "🤝", title: "Trust", text: "Transparent pricing, fast delivery and ongoing support for our customers." },
  { icon: "💡", title: "Innovation", text: "Our platform is constantly improved to deliver a modern, easy shopping experience." },
  { icon: "❤️", title: "Community", text: "We connect stores with buyers and build a community of fashion and style." },
];

export default function AboutPage() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.container}>
          <div style={styles.nav}>
            <Link to="/" style={styles.brand}><span style={styles.brandMark} /><span style={styles.brandText}>FASHION</span></Link>
            <nav style={styles.navLinks}>
              <Link to="/" style={styles.navLink}>HOME</Link>
              <Link to="/about" style={{ ...styles.navLink, ...styles.navLinkActive }}>ABOUT</Link>
              <Link to="/products" style={styles.navLink}>PRODUCTS</Link>
              <Link to="/contact" style={styles.navLink}>CONTACTS</Link>
            </nav>
            <div style={styles.navRight}><UserMenu /></div>
          </div>
        </div>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.container}>
          <div style={styles.heroContent}>
            <p style={styles.heroLabel}>About us</p>
            <h1 style={styles.heroTitle}>The <span style={styles.heroHighlight}>FASHION</span> mission</h1>
            <p style={styles.heroSub}>
              The platform that connects buyers with the best fashion stores. Simple, secure, fast.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.intro}>
        <div style={styles.containerNarrow}>
          <p style={styles.introP}>
            FASHION was created with the idea that online shopping should be transparent and enjoyable. We offer one place where you can explore different stores, compare offers and shop with confidence. Our team works every day to improve your experience.
          </p>
        </div>
      </section>

      <section style={styles.stats}>
        <div style={styles.container}>
          <div style={styles.statsGrid}>
            <div><p style={styles.statNum}>50+</p><span style={styles.statLabel}>Partner stores</span></div>
            <div><p style={styles.statNum}>10k+</p><span style={styles.statLabel}>Happy customers</span></div>
            <div><p style={styles.statNum}>24/7</p><span style={styles.statLabel}>Support</span></div>
            <div><p style={styles.statNum}>100%</p><span style={styles.statLabel}>Secure payment</span></div>
          </div>
        </div>
      </section>

      <section style={styles.values}>
        <div style={styles.container}>
          <h2 style={styles.valuesTitle}>Our values</h2>
          <div style={styles.valuesGrid}>
            {VALUES.map((v) => (
              <div key={v.title} style={styles.valueCard}>
                <span style={styles.valueIcon}>{v.icon}</span>
                <h3 style={styles.valueTitle}>{v.title}</h3>
                <p style={styles.valueText}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.story}>
        <div style={styles.container}>
          <div style={styles.storyInner}>
            <h2 style={styles.storyTitle}>How we started</h2>
            <p style={styles.storyP}>
              FASHION started as a small project to connect local stores with buyers. Today we're here to offer a trusted platform where every store can get exposure and every shopper can find what they're looking for. Trust and quality are at the heart of everything we do.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.cta}>
        <div style={styles.container}>
          <Link to="/products" style={styles.ctaBtn}>Explore products →</Link>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerGrid}>
            <div>
              <div style={styles.footerBrand}><span style={styles.brandMark} /><span>FASHION</span></div>
              <Link to="/about" style={styles.footerLink}>About us</Link>
              <Link to="/contact" style={styles.footerLink}>Contact</Link>
            </div>
            <div>
              <Link to="/" style={styles.footerLink}>HOME</Link>
              <Link to="/products" style={styles.footerLink}>PRODUCTS</Link>
            </div>
          </div>
          <div style={styles.footerBottom}>
            © {new Date().getFullYear()} FASHION. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

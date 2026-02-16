import { useState } from "react";
import { Link } from "react-router-dom";
import UserMenu from "../../components/UserMenu";

const styles = {
  page: { minHeight: "100vh", background: "#F6F6F2", fontFamily: "Inter, system-ui, sans-serif", color: "#0F172A" },
  container: { maxWidth: 1200, margin: "0 auto", padding: "0 18px" },
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

  hero: { position: "relative", background: "linear-gradient(135deg, #1a1d24 0%, #2d3239 50%, #1e2228 100%)", padding: "56px 0" },
  heroOverlay: { position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(242,211,75,.12) 0%, transparent 50%)", pointerEvents: "none" },
  heroContent: { position: "relative", zIndex: 1, textAlign: "center" },
  heroLabel: { margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,.6)", textTransform: "uppercase" },
  heroTitle: { margin: "12px 0 0", fontSize: "clamp(28px, 4.5vw, 40px)", fontWeight: 900, color: "#fff" },
  heroSub: { margin: "14px 0 0", fontSize: 16, color: "rgba(255,255,255,.78)", maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 },

  main: { padding: "48px 0 64px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, alignItems: "start" },

  infoCard: { background: "#FFFFFF", borderRadius: 20, padding: "28px 24px", border: "1px solid rgba(15,23,42,.08)" },
  infoIcon: { fontSize: 32, marginBottom: 12 },
  infoTitle: { margin: 0, fontSize: 16, fontWeight: 900, color: "#0B0F19" },
  infoText: { margin: "8px 0 0", fontSize: 15, color: "rgba(15,23,42,.75)", lineHeight: 1.5 },
  infoLink: { display: "inline-block", marginTop: 8, color: "#0B0F19", fontWeight: 700, fontSize: 14, textDecoration: "none" },

  formCard: { background: "#FFFFFF", borderRadius: 20, padding: "32px 28px", border: "1px solid rgba(15,23,42,.08)" },
  formTitle: { margin: "0 0 20px", fontSize: 20, fontWeight: 900, color: "#0B0F19" },
  formRow: { marginBottom: 18 },
  formLabel: { display: "block", marginBottom: 6, fontSize: 13, fontWeight: 700, color: "rgba(15,23,42,.8)" },
  formInput: { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(15,23,42,.12)", background: "#F8F8F6", fontSize: 15, outline: "none" },
  formTextarea: { width: "100%", minHeight: 120, boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(15,23,42,.12)", background: "#F8F8F6", fontSize: 15, outline: "none", resize: "vertical" },
  formBtn: { marginTop: 8, padding: "14px 26px", borderRadius: 12, background: "#0B0F19", color: "#fff", border: "none", fontWeight: 900, fontSize: 14, cursor: "pointer" },

  mapPlaceholder: { marginTop: 32, background: "#E8E8E4", borderRadius: 16, height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(15,23,42,.5)", fontSize: 15, fontWeight: 600 },

  footer: { background: "#0B0F19", color: "rgba(255,255,255,.85)", padding: "40px 0 24px" },
  footerGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 28, marginBottom: 28 },
  footerBrand: { display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 900, fontSize: 14, marginBottom: 8 },
  footerLink: { display: "block", color: "rgba(255,255,255,.75)", textDecoration: "none", fontSize: 13, marginBottom: 6, fontWeight: 600 },
  footerBottom: { paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.1)", fontSize: 12, opacity: 0.75 },
};

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.container}>
          <div style={styles.nav}>
            <Link to="/" style={styles.brand}><span style={styles.brandMark} /><span style={styles.brandText}>FASHION</span></Link>
            <nav style={styles.navLinks}>
              <Link to="/" style={styles.navLink}>HOME</Link>
              <Link to="/about" style={styles.navLink}>ABOUT</Link>
              <Link to="/products" style={styles.navLink}>PRODUCTS</Link>
              <Link to="/contact" style={{ ...styles.navLink, ...styles.navLinkActive }}>CONTACTS</Link>
            </nav>
            <div style={styles.navRight}><UserMenu /></div>
          </div>
        </div>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.container}>
          <div style={styles.heroContent}>
            <p style={styles.heroLabel}>Contact</p>
            <h1 style={styles.heroTitle}>Get in touch</h1>
            <p style={styles.heroSub}>
              We're here to help. Reach out for questions, support or partnerships.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.main}>
        <div style={styles.container}>
          <div style={styles.grid}>
            <div>
              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>📧</div>
                <h3 style={styles.infoTitle}>Email</h3>
                <p style={styles.infoText}>For general enquiries and support.</p>
                <a href="mailto:info@fashion.com" style={styles.infoLink}>info@fashion.com</a>
              </div>
              <div style={{ ...styles.infoCard, marginTop: 20 }}>
                <div style={styles.infoIcon}>📞</div>
                <h3 style={styles.infoTitle}>Phone</h3>
                <p style={styles.infoText}>Mon – Fri, 09:00 – 18:00.</p>
                <a href="tel:+355001234567" style={styles.infoLink}>+355 00 123 4567</a>
              </div>
              <div style={{ ...styles.infoCard, marginTop: 20 }}>
                <div style={styles.infoIcon}>📍</div>
                <h3 style={styles.infoTitle}>Address</h3>
                <p style={styles.infoText}>Tirana, Albania. Visit us at the office whenever you like.</p>
              </div>
            </div>

            <div>
              <div style={styles.formCard}>
                <h2 style={styles.formTitle}>Send a message</h2>
                {sent ? (
                  <p style={{ margin: 0, fontSize: 15, color: "rgba(15,23,42,.8)", fontWeight: 600 }}>
                    Thank you! Your message was sent. We'll get back to you soon.
                  </p>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={styles.formRow}>
                      <label style={styles.formLabel} htmlFor="contact-name">Name</label>
                      <input id="contact-name" type="text" required placeholder="First and last name" style={styles.formInput} />
                    </div>
                    <div style={styles.formRow}>
                      <label style={styles.formLabel} htmlFor="contact-email">Email</label>
                      <input id="contact-email" type="email" required placeholder="email@example.com" style={styles.formInput} />
                    </div>
                    <div style={styles.formRow}>
                      <label style={styles.formLabel} htmlFor="contact-subject">Subject</label>
                      <input id="contact-subject" type="text" placeholder="What is this about?" style={styles.formInput} />
                    </div>
                    <div style={styles.formRow}>
                      <label style={styles.formLabel} htmlFor="contact-message">Message</label>
                      <textarea id="contact-message" required placeholder="Write your message here…" style={styles.formTextarea} />
                    </div>
                    <button type="submit" style={styles.formBtn}>Send</button>
                  </form>
                )}
              </div>
              <div style={styles.mapPlaceholder}>
                Map – our location (can be added later)
              </div>
            </div>
          </div>
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

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const API = "http://localhost:5083";

export default function StorePage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);

  useEffect(() => {
    (async () => {
      const r = await axios.get(`${API}/api/public/stores/${id}`);
      setStore(r.data.store);
      setProducts(r.data.products ?? []);
    })();
  }, [id]);

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
            <Link to="/login" style={{ ...styles.btn, ...styles.btnGhost }}>
              Login
            </Link>
            <Link to="/register" style={{ ...styles.btn, ...styles.btnPrimary }}>
              Register
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ marginTop: 0 }}>{store?.name ?? "Store"}</h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 18,
              marginTop: 18,
            }}
          >
            {products.map((p) => {
              const pr = Number(p.price || 0);
              const d = Number(p.discountPercent || 0);
              const finalP = d > 0 ? pr * (1 - d / 100) : pr;

              return (
                <div
                  key={p.id}
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 30px rgba(0,0,0,.06)",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={p.imageUrl ? `${API}${p.imageUrl}` : "https://via.placeholder.com/600x400?text=No+Image"}
                      alt={p.name}
                      style={{ width: "100%", height: 170, objectFit: "cover", display: "block" }}
                    />
                    {d > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          background: "#111827",
                          color: "#fff",
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontWeight: 900,
                          fontSize: 12,
                        }}
                      >
                        -{d}%
                      </div>
                    )}
                  </div>

                  <div style={{ padding: 14 }}>
                    <div style={{ fontWeight: 900, fontSize: 16 }}>{p.name}</div>
                    <div style={{ opacity: 0.75, fontSize: 13, marginTop: 6, minHeight: 34 }}>
                      {p.description || "—"}
                    </div>

                    <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div style={{ fontWeight: 900, fontSize: 16 }}>
                        €{finalP.toFixed(2)}
                        {d > 0 && (
                          <span style={{ marginLeft: 8, opacity: 0.6, textDecoration: "line-through", fontWeight: 700, fontSize: 13 }}>
                            €{pr.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 12, opacity: 0.7 }}>
                        Stock: <b>{p.quantity}</b>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
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
};

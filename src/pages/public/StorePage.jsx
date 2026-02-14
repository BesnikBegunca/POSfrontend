// src/pages/public/StorePage.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import UserMenu from "../../components/UserMenu";
import { useTheme, themes } from "../../context/ThemeContext";

const API = "http://localhost:5083";

/* ===========================
   Small inline SVG icons
=========================== */
const Icon = {
  Cart: ({ size = 18 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6.6 6.5h14l-1.6 8.2a2 2 0 0 1-2 1.6H9a2 2 0 0 1-2-1.6L5.6 3.8A1.5 1.5 0 0 0 4.1 2.5H2.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 21a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM17.7 21a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z"
        fill="currentColor"
      />
    </svg>
  ),
  Bolt: ({ size = 18 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13 2 4 14h7l-1 8 10-14h-7l0-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  X: ({ size = 18 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Home: ({ size = 16 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 10.5 12 3l9 7.5V21a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 21V10.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22.5V15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Store: ({ size = 16 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7 6 3h12l2 4v2a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1-3 3 3 3 0 0 1-3-3V7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 12v9a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 21v-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22.5V16.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

function safeGetSession() {
  const token = localStorage.getItem("token");
  if (!token) return { token: null, me: null };

  const fullName = localStorage.getItem("fullName") || "";
  const email = localStorage.getItem("email") || "";
  return { token, me: { fullName, email } };
}

export default function StorePage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const themePalette = themes[theme] || themes.light;

  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);

  const init = safeGetSession();
  const [me, setMe] = useState(init.me);
  const [meLoading, setMeLoading] = useState(!!init.token);

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    (async () => {
      const r = await axios.get(`${API}/api/public/stores/${id}`);
      setStore(r.data.store);
      setProducts(r.data.products ?? []);
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (!token) {
        setMe(null);
        setMeLoading(false);
        return;
      }

      setMeLoading(true);
      try {
        const r = await axios.get(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const nm = {
          fullName:
            r.data?.fullName ??
            r.data?.FullName ??
            r.data?.name ??
            r.data?.Name ??
            "",
          email: r.data?.email ?? r.data?.Email ?? "",
        };

        setMe(nm);
        if (nm.fullName) localStorage.setItem("fullName", nm.fullName);
        if (nm.email) localStorage.setItem("email", nm.email);
      } catch (error) {
        const status = error?.response?.status;
        if (status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("email");
          localStorage.removeItem("fullName");
          setMe(null);
        } else {
          const fullName = localStorage.getItem("fullName") || "";
          const email = localStorage.getItem("email") || "";
          setMe((prev) => prev ?? { fullName, email });
        }
      } finally {
        setMeLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finalPrice = (p) => {
    const pr = Number(p.price || 0);
    const d = Number(p.discountPercent || 0);
    return d > 0 ? pr * (1 - d / 100) : pr;
  };

  function openBuy(p) {
    const fullName = me?.fullName || localStorage.getItem("fullName") || "";
    const email = me?.email || localStorage.getItem("email") || "";
    const price = finalPrice(p);

    const params = new URLSearchParams({
      storeId: id,
      storeName: store?.name || "Store",
      productId: p.id.toString(),
      productName: p.name,
      price: price.toString(),
      qty: "1",
      fullName,
      email,
    });

    nav(`/payment?${params.toString()}`);
  }

  function addToCart(p) {
    const next = [...cart];
    const existing = next.find(
      (x) => x.productId === p.id && x.storeId === Number(id),
    );
    if (existing) existing.qty += 1;
    else
      next.push({
        storeId: Number(id),
        productId: p.id,
        name: p.name,
        price: finalPrice(p),
        imageUrl: p.imageUrl,
        qty: 1,
      });

    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  }

  const cartCount = useMemo(
    () => cart.reduce((s, x) => s + (x.qty || 0), 0),
    [cart],
  );

  return (
    <div
      style={{
        ...styles.page,
        background: themePalette.background,
        color: themePalette.text,
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          ...styles.navbar,
          background: isDark ? "rgba(11,18,32,.9)" : "rgba(255,255,255,.95)",
          borderBottom: isDark
            ? "1px solid rgba(148,163,184,.18)"
            : "1px solid rgba(15,23,42,.08)",
          color: isDark ? "#fff" : "#0f172a",
        }}
      >
        <Link
          to="/"
          style={{ ...styles.logoLink, color: isDark ? "#fff" : "#0f172a" }}
        >
          <div style={{ ...styles.logo, color: isDark ? "#fff" : "#0f172a" }}>
            <span style={styles.logoDot} />
            MyStore
          </div>
        </Link>

        <div style={styles.navRight}>
          <div style={styles.navLinks}>
            <Link
              to="/"
              style={{
                ...styles.navLink,
                color: isDark ? "rgba(226,232,240,.9)" : "#0f172a",
                border: isDark
                  ? styles.navLink.border
                  : "1px solid rgba(15,23,42,.08)",
              }}
            >
              <span style={styles.navIcon}>
                <Icon.Home />
              </span>
              Home
            </Link>
            <Link
              to="/stores"
              style={{
                ...styles.navLink,
                color: isDark ? "rgba(226,232,240,.9)" : "#0f172a",
                border: isDark
                  ? styles.navLink.border
                  : "1px solid rgba(15,23,42,.08)",
              }}
            >
              <span style={styles.navIcon}>
                <Icon.Store />
              </span>
              Stores
            </Link>
          </div>

          <div
            style={{
              ...styles.cartPill,
              background: isDark ? styles.cartPill.background : "#f8fafc",
              border: isDark
                ? styles.cartPill.border
                : "1px solid rgba(15,23,42,.12)",
              color: isDark ? styles.cartPill.color : "#0f172a",
            }}
            title="Cart (later)"
          >
            <Icon.Cart />
            <b style={{ marginLeft: 8 }}>{cartCount}</b>
          </div>

          <div style={styles.authBtns}>
            <UserMenu />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            style={{
              ...styles.themeToggle,
              background: isDark ? "rgba(255,255,255,.12)" : "#f1f5f9",
              color: isDark ? "#f8fafc" : "#0f172a",
              border: isDark
                ? "1px solid rgba(255,255,255,.22)"
                : "1px solid rgba(15,23,42,.12)",
            }}
            aria-label="Toggle theme"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </nav>

      <div
        style={{
          ...styles.body,
          background: isDark
            ? "radial-gradient(1200px 600px at 20% -10%, rgba(59,130,246,.12), transparent 60%), radial-gradient(900px 500px at 85% 0%, rgba(16,185,129,.12), transparent 55%), #0b1220"
            : styles.body.background,
        }}
      >
        <div style={styles.container}>
          <div style={styles.headerRow}>
            <div>
              <h1
                style={{
                  ...styles.h1,
                  color: isDark ? "#f8fafc" : styles.h1.color,
                }}
              >
                {store?.name ?? "Store"}
              </h1>
              <div
                style={{
                  ...styles.subtle,
                  color: isDark ? "rgba(226,232,240,.75)" : styles.subtle.color,
                }}
              >
                Browse products and order instantly with “Buy now”.
              </div>
            </div>

            <div style={styles.userChip}>
              {meLoading ? (
                <span style={{ opacity: 0.75, fontSize: 13 }}>
                  Checking session…
                </span>
              ) : me?.email || me?.fullName ? (
                <>
                  <span style={styles.userDot} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{ fontWeight: 900, fontSize: 12, lineHeight: 1.1 }}
                    >
                      {me.fullName || "User"}
                    </span>
                    <span
                      style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.1 }}
                    >
                      {me.email || ""}
                    </span>
                  </div>
                </>
              ) : (
                <span style={{ opacity: 0.75, fontSize: 13 }}>
                  Not logged in
                </span>
              )}
            </div>
          </div>

          <div style={styles.grid}>
            {products.map((p) => {
              const pr = Number(p.price || 0);
              const d = Number(p.discountPercent || 0);
              const fp = finalPrice(p);

              return (
                <div key={p.id} style={styles.card}>
                  <div style={styles.cardMedia}>
                    <img
                      src={
                        p.imageUrl
                          ? `${API}${p.imageUrl}`
                          : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
                      }
                      alt={p.name}
                      style={styles.cardImg}
                      onError={(e) => {
                        console.error(
                          `Image failed to load for product "${p.name}". URL was: ${p.imageUrl || "(empty)"}`,
                        );
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%23d1d5db' text-anchor='middle' dy='.3em'%3EImage Not Found%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    {d > 0 && <div style={styles.badgeDiscount}>-{d}%</div>}
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.cardTitle}>{p.name}</div>
                    <div style={styles.cardDesc}>{p.description || "—"}</div>

                    <div style={styles.priceRow}>
                      <div style={styles.price}>
                        €{fp.toFixed(2)}
                        {d > 0 && (
                          <span style={styles.priceStrike}>
                            €{pr.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div style={styles.stock}>
                        Stock: <b>{p.quantity}</b>
                      </div>
                    </div>

                    <div style={styles.actionsRow}>
                      <button onClick={() => openBuy(p)} style={styles.buyBtn}>
                        <span style={styles.btnIcon}>
                          <Icon.Bolt />
                        </span>
                        Buy now
                      </button>

                      <button
                        onClick={() => addToCart(p)}
                        style={styles.cartBtn}
                      >
                        <span style={styles.btnIcon}>
                          <Icon.Cart />
                        </span>
                        Add to cart
                      </button>
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

function Field({ label, value, onChange, type = "text", readOnly = false }) {
  return (
    <label style={styles.field}>
      <div style={styles.fieldLabel}>{label}</div>
      <input
        type={type}
        value={value ?? ""}
        onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
        readOnly={readOnly}
        disabled={readOnly}
        style={{
          ...styles.input,
          ...(readOnly ? styles.inputReadOnly : {}),
        }}
      />
    </label>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b1220",
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#0f172a",
  },

  navbar: {
    height: 68,
    padding: "0 clamp(16px, 4vw, 28px)",
    background: "rgba(11,18,32,.9)",
    borderBottom: "1px solid rgba(148,163,184,.18)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 20,
    backdropFilter: "blur(10px)",
  },

  logoLink: { textDecoration: "none", color: "#fff" },
  logo: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 950,
    fontSize: 18,
    letterSpacing: 0.2,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    background: "linear-gradient(135deg, #22c55e, #60a5fa)",
    boxShadow: "0 10px 18px rgba(34,197,94,.25)",
  },

  navRight: { display: "flex", alignItems: "center", gap: 14 },
  navLinks: { display: "flex", gap: 10, alignItems: "center" },

  navLink: {
    color: "rgba(226,232,240,.9)",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 13,
    padding: "10px 12px",
    borderRadius: 12,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid transparent",
  },
  navIcon: {
    width: 18,
    height: 18,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.95,
  },

  cartPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(148,163,184,.22)",
    fontSize: 13,
    fontWeight: 900,
    color: "#e2e8f0",
  },

  authBtns: { display: "flex", gap: 10, alignItems: "center" },
  themeToggle: {
    height: 34,
    padding: "0 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
    letterSpacing: 0.3,
  },

  body: {
    minHeight: "calc(100vh - 68px)",
    background:
      "radial-gradient(1200px 600px at 20% -10%, rgba(96,165,250,.22), transparent 60%), radial-gradient(900px 500px at 85% 0%, rgba(34,197,94,.18), transparent 55%), #f8fafc",
    padding: 24,
  },

  container: { maxWidth: 1200, margin: "0 auto" },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 16,
    marginBottom: 16,
  },
  h1: { margin: 0, fontSize: 28, letterSpacing: -0.2, color: "#0f172a" },
  subtle: { marginTop: 6, fontSize: 13, opacity: 0.72 },

  userChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 14,
    background: "rgba(255,255,255,.75)",
    border: "1px solid rgba(148,163,184,.35)",
    boxShadow: "0 12px 30px rgba(2,6,23,.06)",
    minWidth: 220,
    justifyContent: "center",
  },
  userDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    background: "#22c55e",
    boxShadow: "0 10px 18px rgba(34,197,94,.2)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
    gap: 18,
    marginTop: 18,
  },

  card: {
    background: "rgba(255,255,255,.85)",
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(148,163,184,.35)",
    boxShadow: "0 16px 50px rgba(2,6,23,.08)",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: { position: "relative" },
  cardImg: { width: "100%", height: 175, objectFit: "cover", display: "block" },

  badgeDiscount: {
    position: "absolute",
    top: 12,
    left: 12,
    background: "rgba(15,23,42,.92)",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 950,
    fontSize: 12,
    border: "1px solid rgba(255,255,255,.18)",
  },

  cardBody: { padding: 14, flex: 1, display: "flex", flexDirection: "column" },
  cardTitle: { fontWeight: 950, fontSize: 16, color: "#0f172a" },
  cardDesc: { opacity: 0.76, fontSize: 13, marginTop: 6, minHeight: 34 },

  priceRow: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  price: { fontWeight: 950, fontSize: 16, color: "#0f172a" },
  priceStrike: {
    marginLeft: 8,
    opacity: 0.55,
    textDecoration: "line-through",
    fontWeight: 800,
    fontSize: 13,
  },
  stock: { fontSize: 12, opacity: 0.7 },

  actionsRow: { display: "flex", gap: 10, marginTop: 14 },

  btnIcon: {
    width: 18,
    height: 18,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },

  buyBtn: {
    border: 0,
    cursor: "pointer",
    padding: "10px 12px",
    borderRadius: 14,
    fontWeight: 950,
    fontSize: 13,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flex: 1,
    color: "#062312",
    background: "linear-gradient(135deg, #22c55e, #86efac)",
    boxShadow: "0 14px 28px rgba(34,197,94,.18)",
  },

  cartBtn: {
    border: "1px solid rgba(148,163,184,.55)",
    cursor: "pointer",
    padding: "10px 12px",
    borderRadius: 14,
    fontWeight: 950,
    fontSize: 13,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flex: 1,
    color: "#0f172a",
    background: "rgba(255,255,255,.92)",
  },

  /* MODAL */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,.58)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 1000,
  },

  modal: {
    width: "min(620px, 100%)",
    maxHeight: "78vh",
    background: "rgba(255,255,255,.97)",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 40px 120px rgba(0,0,0,.35)",
    border: "1px solid rgba(148,163,184,.35)",
  },

  modalHeader: {
    padding: "14px 16px",
    borderBottom: "1px solid rgba(148,163,184,.28)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(248,250,252,.95)",
  },
  modalTitle: { fontWeight: 950, fontSize: 16, color: "#0f172a" },
  modalSubtitle: { fontSize: 12, opacity: 0.75, marginTop: 2 },

  closeBtn: {
    border: "1px solid rgba(148,163,184,.35)",
    background: "rgba(255,255,255,.9)",
    cursor: "pointer",
    borderRadius: 12,
    padding: 8,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modalBody: {
    padding: 16,
    overflowY: "auto",
    maxHeight: "calc(78vh - 60px)",
  },

  summaryRow: {
    display: "grid",
    gridTemplateColumns: "1fr 110px 130px",
    gap: 10,
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.35)",
    background: "rgba(248,250,252,.92)",
    marginBottom: 12,
  },

  qtyBox: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 10,
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.28)",
    background: "rgba(255,255,255,.9)",
  },

  qtyInput: {
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.45)",
    padding: "10px 10px",
    outline: "none",
    fontWeight: 900,
    fontSize: 14,
    background: "rgba(255,255,255,.98)",
  },

  totalBoxMini: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 10,
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.28)",
    background: "rgba(255,255,255,.9)",
  },

  formCol: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
    marginBottom: 12,
  },

  field: { display: "block" },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 950,
    marginBottom: 6,
    color: "#0f172a",
  },

  input: {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.45)",
    padding: "11px 12px",
    outline: "none",
    fontSize: 14,
    background: "rgba(255,255,255,.98)",
  },

  inputReadOnly: {
    background: "rgba(241,245,249,.9)",
    color: "#64748b",
    cursor: "not-allowed",
    border: "1px solid rgba(148,163,184,.35)",
  },

  payBox: {
    border: "1px solid rgba(148,163,184,.35)",
    borderRadius: 14,
    padding: 12,
    background: "rgba(255,255,255,.92)",
  },

  tip: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.75,
  },

  warn: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(239,68,68,.35)",
    background: "rgba(239,68,68,.06)",
    fontSize: 13,
    fontWeight: 800,
    color: "#991b1b",
  },

  hint: {
    marginTop: 12,
    fontSize: 12,
    opacity: 0.75,
    background: "rgba(241,245,249,.9)",
    border: "1px solid rgba(148,163,184,.35)",
    padding: "10px 12px",
    borderRadius: 14,
  },
};

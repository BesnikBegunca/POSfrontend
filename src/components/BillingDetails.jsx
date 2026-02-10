import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5083";

/* ---------- tiny svg icons ---------- */
const I = {
  Lock: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M6.5 11h11A1.5 1.5 0 0 1 19 12.5v7A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5v-7A1.5 1.5 0 0 1 6.5 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function BillingDetails() {
  const nav = useNavigate();
  const q = useQuery();

  // optional: pass product data via query params for demo
  const productName = q.get("name") || "Demo product";
  const price = Number(q.get("price") || 19.99);
  const storeName = q.get("store") || "MyStore";

  const [me, setMe] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return {
      fullName: localStorage.getItem("fullName") || "",
      email: localStorage.getItem("email") || "",
    };
  });

  const [form, setForm] = useState({
    fullName: me?.fullName || "",
    email: me?.email || "",
    phone: "",
    address: "",
    city: "",
    country: "Kosovo",
    zip: "",
    qty: 1,
  });

  const [msg, setMsg] = useState("");

  // refresh /me (optional)
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const r = await axios.get(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fullName = r.data?.fullName ?? r.data?.FullName ?? r.data?.name ?? r.data?.Name ?? "";
        const email = r.data?.email ?? r.data?.Email ?? "";

        const nm = { fullName, email };
        setMe(nm);

        if (fullName) localStorage.setItem("fullName", fullName);
        if (email) localStorage.setItem("email", email);

        setForm((s) => ({
          ...s,
          fullName: fullName || s.fullName,
          email: email || s.email,
        }));
      } catch {
        // ignore - demo
      }
    })();
  }, []);

  const total = (price * Number(form.qty || 0)).toFixed(2);

  function onNext(e) {
    e.preventDefault();
    setMsg("");

    if (!form.fullName.trim()) return setMsg("Full name missing.");
    if (!form.email.trim()) return setMsg("Email missing.");
    if (!form.phone.trim()) return setMsg("Phone missing.");
    if (!form.address.trim()) return setMsg("Address missing.");
    if (Number(form.qty) <= 0) return setMsg("Qty must be > 0.");

    // Navigate to payment with form data as query params
    const params = new URLSearchParams({
      name: productName,
      price: price.toString(),
      store: storeName,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      country: form.country,
      zip: form.zip,
      qty: form.qty.toString(),
    });

    nav(`/payment?${params.toString()}`);
  }

  return (
    <div style={S.card}>
      <div style={S.top}>
        <div style={S.titleRow}>
          <div style={S.title}>Billing Details</div>
          <div style={S.secure}>
            <I.Lock />
            Secure
          </div>
        </div>
        <div style={S.sub}>Enter your billing and shipping information</div>
      </div>

      <div style={S.summary}>
        <div>
          <div style={S.sumLabel}>Store</div>
          <div style={S.sumValue}>{storeName}</div>
        </div>
        <div>
          <div style={S.sumLabel}>Product</div>
          <div style={S.sumValue}>{productName}</div>
        </div>
        <div>
          <div style={S.sumLabel}>Total</div>
          <div style={S.sumValue}>€{total}</div>
        </div>
      </div>

      <form onSubmit={onNext} style={S.form}>
        <div style={S.grid2}>
          <Field
            label="Full name"
            value={form.fullName}
            onChange={(v) => setForm((s) => ({ ...s, fullName: v }))}
            readOnly={!!me?.fullName}
          />
          <Field
            label="Email"
            value={form.email}
            onChange={(v) => setForm((s) => ({ ...s, email: v }))}
            readOnly={!!me?.email}
          />
        </div>

        <div style={S.grid2}>
          <Field label="Phone" value={form.phone} onChange={(v) => setForm((s) => ({ ...s, phone: v }))} />
          <Field
            label="Qty"
            type="number"
            value={form.qty}
            onChange={(v) => setForm((s) => ({ ...s, qty: Number(v) }))}
          />
        </div>

        <div style={S.grid1}>
          <Field label="Address" value={form.address} onChange={(v) => setForm((s) => ({ ...s, address: v }))} />
        </div>

        <div style={S.grid3}>
          <Field label="City" value={form.city} onChange={(v) => setForm((s) => ({ ...s, city: v }))} />
          <Field label="Country" value={form.country} onChange={(v) => setForm((s) => ({ ...s, country: v }))} />
          <Field label="ZIP" value={form.zip} onChange={(v) => setForm((s) => ({ ...s, zip: v }))} />
        </div>

        {msg && <div style={S.msg}>{msg}</div>}

        <div style={S.footer}>
          <button style={S.backBtn} onClick={() => nav("/stores")}>← Back</button>
          <button style={S.nextBtn} type="submit">
            Next: Payment →
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- small field component ---------- */
function Field({ label, value, onChange, type = "text", readOnly = false }) {
  return (
    <label style={S.field}>
      <div style={S.label}>{label}</div>
      <input
        type={type}
        value={value ?? ""}
        onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
        readOnly={readOnly}
        disabled={readOnly}
        style={{ ...S.input, ...(readOnly ? S.readOnly : {}) }}
      />
    </label>
  );
}

const S = {
  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    color: "#e9eefb",
    overflow: "hidden",
    boxShadow: "0 30px 120px rgba(0,0,0,.35)",
  },
  top: { padding: 16, borderBottom: "1px solid rgba(255,255,255,0.10)" },
  titleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  title: { fontSize: 18, fontWeight: 950, letterSpacing: 0.2 },
  secure: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(34,197,94,0.12)",
    border: "1px solid rgba(34,197,94,0.25)",
    color: "#b6ffcf",
    fontSize: 12,
    fontWeight: 900,
  },
  sub: { marginTop: 8, opacity: 0.8, fontSize: 13 },

  summary: {
    padding: 16,
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
    borderBottom: "1px solid rgba(255,255,255,0.10)",
  },
  sumLabel: { fontSize: 11, opacity: 0.7, fontWeight: 900 },
  sumValue: { marginTop: 5, fontWeight: 950 },

  form: { padding: 16, display: "grid", gap: 12 },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  grid1: { display: "grid", gridTemplateColumns: "1fr", gap: 12 },

  field: { display: "block" },
  label: { fontSize: 12, fontWeight: 950, marginBottom: 6 },
  input: {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    padding: "11px 12px",
    outline: "none",
    fontSize: 14,
    background: "rgba(255,255,255,0.06)",
    color: "#e9eefb",
  },
  readOnly: {
    background: "rgba(255,255,255,0.03)",
    color: "rgba(226,232,240,.75)",
    cursor: "not-allowed",
  },

  msg: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    fontSize: 13,
    fontWeight: 800,
  },

  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6, gap: 12 },
  backBtn: {
    border: "1px solid rgba(255,255,255,0.16)",
    background: "transparent",
    color: "#cbd5f5",
    borderRadius: 14,
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 800,
  },
  nextBtn: {
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "#ffffff",
    borderRadius: 16,
    padding: "16px 20px",
    cursor: "pointer",
    fontWeight: 950,
    fontSize: 16,
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    minWidth: 200,
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
    transition: "all 0.2s ease",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
};

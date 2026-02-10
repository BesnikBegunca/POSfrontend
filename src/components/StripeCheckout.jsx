// src/pages/public/StripeCheckout.jsx
import { useEffect, useMemo, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Card: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 7.5h15A2 2 0 0 1 21.5 9.5v8a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M2.5 11h19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Check: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function StripeCheckout() {
  const stripe = useStripe();
  const elements = useElements();
  const nav = useNavigate();
  const q = useQuery();

  // optional: pass product data via query params for demo
  const productName = q.get("name") || "Demo product";
  const price = Number(q.get("price") || 19.99);
  const storeName = q.get("store") || "MyStore";

  // optional: productId from query (recommended)
  const productId = Number(q.get("productId") || 0);

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
    notes: "",
    qty: 1,
  });

  const [loading, setLoading] = useState(false);
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

        const fullName =
          r.data?.fullName ?? r.data?.FullName ?? r.data?.name ?? r.data?.Name ?? "";
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

  async function onPay(e) {
    e.preventDefault();
    setMsg("");

    if (!stripe || !elements) return;

    if (!form.fullName.trim()) return setMsg("Full name missing.");
    if (!form.email.trim()) return setMsg("Email missing.");
    if (!form.phone.trim()) return setMsg("Phone missing.");
    if (!form.address.trim()) return setMsg("Address missing.");
    if (Number(form.qty) <= 0) return setMsg("Qty must be > 0.");

    const token = localStorage.getItem("token");
    if (!token) return setMsg("You must login first.");

    setLoading(true);
    try {
      // 1) Create PaymentIntent in backend -> get clientSecret
      const amountCents = Math.round(price * Number(form.qty || 1) * 100);

      const intentRes = await axios.post(
        `${API}/api/payments/create-intent`,
        {
          amountCents,
          productId: productId || 1, // ✅ if you don't pass productId, fallback to 1
          qty: Number(form.qty || 1),
          // ⚠️ do NOT send storeId if backend reads from JWT
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const clientSecret = intentRes.data?.clientSecret;
      if (!clientSecret) {
        setMsg("Missing clientSecret from backend.");
        return;
      }

      // 2) Confirm the payment (THIS is what you were missing)
      const card = elements.getElement(CardElement);
      if (!card) {
        setMsg("Card element missing.");
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: form.fullName,
            email: form.email,
            phone: form.phone,
            address: {
              line1: form.address,
              city: form.city,
              postal_code: form.zip,
              country: "XK",
            },
          },
        },
      });

      if (result.error) {
        setMsg(result.error.message || "Payment failed.");
        return;
      }

      const status = result.paymentIntent?.status;

      if (status === "succeeded") {
        setMsg("Payment succeeded ✅");
        setTimeout(() => nav("/stores"), 900);
      } else {
        setMsg(`Payment status: ${status}`);
      }
    } catch (err) {
      console.error(err);
      setMsg(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Payment failed. Check console."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.card}>
      <div style={S.top}>
        <div style={S.titleRow}>
          <div style={S.title}>Checkout</div>
          <div style={S.secure}>
            <I.Lock />
            Secure
          </div>
        </div>
        <div style={S.sub}>
          Demo Stripe payment — use test card <b>4242 4242 4242 4242</b>
        </div>
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

      <form onSubmit={onPay} style={S.form}>
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

        <div style={S.cardBox}>
          <div style={S.cardLabel}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <I.Card /> Card details
            </span>
          </div>

          <div style={S.cardInput}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#0f172a",
                    "::placeholder": { color: "rgba(100,116,139,.8)" },
                  },
                  invalid: { color: "#b91c1c" },
                },
              }}
            />
          </div>

          <div style={S.cardHint}>
            Test: <b>4242 4242 4242 4242</b> • any future date • any CVC
          </div>
        </div>

        {msg && <div style={S.msg}>{msg}</div>}

        <div style={S.footer}>
          <Link to="/stores" style={S.backLink}>
            ← Back
          </Link>

          <button disabled={!stripe || loading} style={S.payBtn} type="submit">
            <I.Check />
            {loading ? "Processing..." : `Pay €${total}`}
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

  cardBox: {
    marginTop: 4,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    padding: 12,
  },
  cardLabel: { fontSize: 12, fontWeight: 950, marginBottom: 10, opacity: 0.9 },
  cardInput: {
    borderRadius: 14,
    padding: "12px 12px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.92)",
    color: "#0f172a",
  },
  cardHint: { marginTop: 8, fontSize: 12, opacity: 0.8 },

  msg: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    fontSize: 13,
    fontWeight: 800,
  },

  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6, gap: 12 },
  backLink: { color: "#cbd5f5", textDecoration: "none", fontWeight: 800 },

  payBtn: {
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

import { useEffect, useState } from "react";
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
  return new URLSearchParams(search);
}

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const nav = useNavigate();
  const q = useQuery();

  // Get billing details from query params
  const productName = q.get("productName") || "Demo product";
  const price = Number(q.get("price") || 19.99);
  const storeName = q.get("storeName") || "MyStore";
  const storeId = q.get("storeId") || "";
  const productId = q.get("productId") || "";
  const fullName = q.get("fullName") || "";
  const email = q.get("email") || "";
  const qty = Number(q.get("qty") || 1);

  const [form, setForm] = useState({
    fullName,
    email,
    phone: "",
    address: "",
    city: "",
    country: "Kosovo",
    zip: "",
    qty,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const total = (price * qty).toFixed(2);

  async function onPay(e) {
    e.preventDefault();
    setMsg("");

    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // ✅ DEMO ONLY:
      // Normally here you call backend to create PaymentIntent,
      // then confirmCardPayment(clientSecret).
      //
      // For presentation: we just validate card element and "simulate success".

      const card = elements.getElement(CardElement);
      const { error } = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: {
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          address: {
            line1: form.address,
            city: form.city,
            postal_code: form.zip,
            country: "XK", // Kosovo
          },
        },
      });

      if (error) {
        setMsg(error.message || "Card error.");
        setLoading(false);
        return;
      }

      // ✅ optional: save order in your backend (demo order)
      // const token = localStorage.getItem("token");
      // await axios.post(`${API}/api/public/orders`, { ... }, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });

      setMsg("Payment confirmed (demo) ✅");
      setTimeout(() => nav("/products"), 900);
    } catch (err) {
      console.error(err);
      setMsg("Payment failed. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.card}>
      <div style={S.top}>
        <div style={S.titleRow}>
          <div style={S.title}>Payment</div>
          <div style={S.secure}>
            <I.Lock />
            Secure
          </div>
        </div>
        <div style={S.sub}>Demo Stripe payment — use test card <b>4242 4242 4242 4242</b></div>
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

      <div style={S.billing}>
        <div style={S.billingTitle}>Billing Details</div>
        <div style={S.billingGrid}>
          <div><strong>Name:</strong> {form.fullName}</div>
          <div><strong>Email:</strong> {form.email}</div>
          <div><strong>Phone:</strong> {form.phone}</div>
          <div><strong>Address:</strong> {form.address}, {form.city}, {form.country} {form.zip}</div>
          <div><strong>Qty:</strong> {form.qty}</div>
        </div>
      </div>

      <form onSubmit={onPay} style={S.form}>
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
          <Link to="/checkout" style={S.backLink}>← Back to Details</Link>

          <button disabled={!stripe || loading} style={S.payBtn} type="submit">
            <I.Check />
            {loading ? "Processing..." : `Pay €${total}`}
          </button>
        </div>
      </form>
    </div>
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

  billing: {
    padding: 16,
    borderBottom: "1px solid rgba(255,255,255,0.10)",
  },
  billingTitle: { fontSize: 14, fontWeight: 950, marginBottom: 12 },
  billingGrid: { display: "grid", gap: 8, fontSize: 13 },

  form: { padding: 16, display: "grid", gap: 12 },

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

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5083";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function PaymentPage() {
  const stripe = useStripe();
  const elements = useElements();
  const nav = useNavigate();
  const q = useQuery();

  // from URL:
  const storeId = Number(q.get("storeId") || 0);
  const storeName = q.get("storeName") || "";
  const productId = Number(q.get("productId") || 0);
  const productName = q.get("productName") || "";
  const price = Number(q.get("price") || 0);
  const qty = Number(q.get("qty") || 1);
  const fullName = q.get("fullName") || "";
  const email = q.get("email") || "";

  const amountCents = Math.round(price * qty * 100);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const pay = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!stripe || !elements) return setMsg("Stripe not ready yet.");
    if (!storeId) return setMsg("Missing storeId in URL.");
    if (!productId) return setMsg("Missing productId in URL.");
    if (!amountCents || amountCents <= 0) return setMsg("Invalid amount.");

    try {
      setLoading(true);

      // 1) create intent on backend
      // NOTE:
      // - If your backend create-intent is [AllowAnonymous], no token needed.
      // - If it requires auth, add Authorization header below.
      const token = localStorage.getItem("token");

      const intentRes = await axios.post(
        `${API}/api/payments/create-intent`,
        {
          amountCents,
          storeId,        // ✅ for public checkout
          productId,
          qty,
          // optional:
          buyerName: fullName,
          buyerEmail: email,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      const clientSecret = intentRes.data?.clientSecret;
      if (!clientSecret) {
        setMsg("Missing clientSecret from backend.");
        return;
      }

      // 2) confirm payment with card details
      const card = elements.getElement(CardElement);
      if (!card) {
        setMsg("Card element missing.");
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: fullName || undefined,
            email: email || undefined,
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
        // kthehu ku don
        setTimeout(() => nav("/stores"), 800);
      } else {
        setMsg(`Payment status: ${status}`);
      }
    } catch (err) {
      console.error(err);
      setMsg(
        err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Payment failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1220",
        padding: 24,
        display: "grid",
        placeItems: "center",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#e9eefb",
      }}
    >
      <div
        style={{
          width: "min(720px, 100%)",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 30px 120px rgba(0,0,0,.35)",
        }}
      >
        <div style={{ padding: 16, borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
          <div style={{ fontSize: 18, fontWeight: 950 }}>Payment</div>
          <div style={{ opacity: 0.8, marginTop: 6, fontSize: 13 }}>
            Store: <b>{storeName || `#${storeId}`}</b> • Product: <b>{productName || `#${productId}`}</b>
          </div>
          <div style={{ opacity: 0.85, marginTop: 6, fontSize: 13 }}>
            Total: <b>€{(amountCents / 100).toFixed(2)}</b> (qty {qty})
          </div>
        </div>

        <form onSubmit={pay} style={{ padding: 16, display: "grid", gap: 12 }}>
          <div
            style={{
              borderRadius: 14,
              padding: "12px 12px",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.92)",
              color: "#0f172a",
            }}
          >
            <CardElement />
          </div>

          {msg && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.04)",
                fontSize: 13,
                fontWeight: 800,
                whiteSpace: "pre-wrap",
              }}
            >
              {msg}
            </div>
          )}

          <button
            disabled={!stripe || loading}
            style={{
              border: "none",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              color: "#ffffff",
              borderRadius: 16,
              padding: "16px 20px",
              cursor: "pointer",
              fontWeight: 950,
              fontSize: 16,
            }}
            type="submit"
          >
            {loading ? "Processing..." : `Pay €${(amountCents / 100).toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}

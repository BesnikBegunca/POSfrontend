// src/pages/owner/OwnerPayments.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5083";

export default function OwnerPayments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        setLoading(true);

        if (!token) {
          setErr("Missing token. Please login again.");
          setRows([]);
          return;
        }

        // ✅ server e merr storeId prej JWT claim storeId
        // Endpoint: GET /api/payments/my?limit=50
        const r = await axios.get(`${API}/api/payments/my?limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRows(Array.isArray(r.data) ? r.data : []);
      } catch (e) {
        console.error(e);
        setErr(
          e?.response?.data?.message ||
            e?.response?.data ||
            "Failed to load payments"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div>
          <div style={S.title}>💳 Payments</div>
          <div style={S.sub}>My store payments</div>
        </div>
        <button onClick={() => window.location.reload()} style={S.btn}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={S.box}>Loading...</div>
      ) : err ? (
        <div style={{ ...S.box, borderColor: "rgba(255,80,80,.35)" }}>
          {String(err)}
        </div>
      ) : rows.length === 0 ? (
        <div style={S.box}>No payments yet.</div>
      ) : (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Date</th>
                <th style={S.th}>Amount</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Buyer</th>
                <th style={S.th}>Email</th>
                <th style={S.th}>ProductId</th>
                <th style={S.th}>Qty</th>
                <th style={S.th}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x, i) => (
                <tr key={x.paymentIntentId || x.paymentIntentId === "" ? x.paymentIntentId : i}>
                  <td style={S.td}>
                    {formatDate(x.createdAt || x.created || x.createdUtc)}
                  </td>
                  <td style={S.td}>€{((x.amountCents || 0) / 100).toFixed(2)}</td>
                  <td style={S.td}>
                    <span style={badge(x.status)}>{x.status}</span>
                  </td>
                  <td style={S.td}>{x.buyerName || "—"}</td>
                  <td style={S.td}>{x.buyerEmail || "—"}</td>
                  <td style={S.td}>{x.productId || "—"}</td>
                  <td style={S.td}>{x.qty || "—"}</td>
                  <td style={S.td}>
                    {x.receiptUrl ? (
                      <a
                        href={x.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={S.link}
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatDate(v) {
  if (!v) return "—";
  const d = typeof v === "string" ? new Date(v) : new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

function badge(status) {
  const ok = String(status || "").toLowerCase() === "succeeded";
  return {
    display: "inline-flex",
    padding: "4px 10px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
    background: ok ? "rgba(34,197,94,.12)" : "rgba(251,191,36,.12)",
    border: ok
      ? "1px solid rgba(34,197,94,.25)"
      : "1px solid rgba(251,191,36,.25)",
    color: ok ? "#b6ffcf" : "#ffe6a7",
  };
}

const S = {
  wrap: { display: "grid", gap: 12 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: 950 },
  sub: { fontSize: 12, opacity: 0.75, marginTop: 2 },
  btn: {
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.18)",
    background: "rgba(255,255,255,.06)",
    color: "#e9eefb",
    fontWeight: 900,
    padding: "10px 12px",
    cursor: "pointer",
  },
  box: {
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.06)",
  },
  tableWrap: {
    overflow: "auto",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.04)",
  },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 900 },
  th: {
    textAlign: "left",
    fontSize: 12,
    opacity: 0.8,
    padding: 12,
    borderBottom: "1px solid rgba(255,255,255,.10)",
  },
  td: {
    padding: 12,
    borderBottom: "1px solid rgba(255,255,255,.08)",
    fontSize: 13,
  },
  link: { color: "#cbd5f5", fontWeight: 900, textDecoration: "none" },
};

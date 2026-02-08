import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5083";

export default function ManagerProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = async () => {
    setErr("");
    setMsg("");
    try {
      setLoading(true);
      const r = await axios.get(`${API}/api/manager/products`, { headers });
      setItems(r.data ?? []);
    } catch (e) {
      const data = e?.response?.data;
      setErr(typeof data === "string" ? data : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setErr("No token. Login as Manager.");
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setDiscountPercent("");
    setQuantity("");
    setImageFile(null);
    const el = document.getElementById("product-image");
    if (el) el.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!name.trim()) return setErr("Name is required.");
    if (!price || Number(price) <= 0) return setErr("Price must be > 0.");
    if (!quantity || Number(quantity) < 0) return setErr("Quantity must be >= 0.");
    if (discountPercent && (Number(discountPercent) < 0 || Number(discountPercent) > 100))
      return setErr("Discount must be 0..100.");

    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("description", description.trim());
      fd.append("price", String(price));
      fd.append("discountPercent", String(discountPercent || 0));
      fd.append("quantity", String(quantity));
      if (imageFile) fd.append("image", imageFile);

      const r = await axios.post(`${API}/api/manager/products`, fd, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });

      setMsg(`Created ✅ ${r.data?.name ?? name}`);
      resetForm();
      load();
    } catch (e2) {
      const data = e2?.response?.data;
      setErr(typeof data === "string" ? data : JSON.stringify(data ?? "Error"));
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setMsg("");
    setErr("");
    try {
      await axios.delete(`${API}/api/manager/products/${id}`, { headers });
      setMsg("Deleted ✅");
      load();
    } catch (e) {
      const data = e?.response?.data;
      setErr(typeof data === "string" ? data : "Delete failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>Manager • Products</h1>
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            Add products for your store. Here you manage them in a list/table.
          </div>
        </div>
      </div>

      <div style={styles.layout}>
        {/* LEFT: FORM */}
        <div style={styles.panel}>
          <h3 style={{ marginTop: 0 }}>Add Product</h3>

          <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
            <input style={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />

            <textarea
              style={{ ...inp, minHeight: 90, resize: "vertical" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />

            <div style={styles.row2}>
              <input
                style={inp}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price (e.g. 9.99)"
                inputMode="decimal"
              />
              <input
                style={inp}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="Discount % (0-100)"
                inputMode="numeric"
              />
            </div>

            <input
              style={inp}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity (stock)"
              inputMode="numeric"
            />

            <input
              id="product-image"
              type="file"
              accept="image/*"
              style={{ ...inp, padding: 10 }}
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />

            <button style={btn}>Create</button>
          </form>

          {msg && <div style={styles.success}>{msg}</div>}
          {err && <div style={styles.error}>{err}</div>}
        </div>

        {/* RIGHT: LIST/TABLE */}
        <div style={styles.panel}>
          <div style={styles.listHeader}>
            <h3 style={{ margin: 0 }}>Your Products</h3>
            <button onClick={load} style={btnSmall}>Refresh</button>
          </div>

          {loading ? (
            <div style={{ opacity: 0.8 }}>Loading…</div>
          ) : items.length === 0 ? (
            <div style={{ opacity: 0.8 }}>No products yet.</div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Photo</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Discount</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.thRight}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => {
                    const pr = Number(p.price || 0);
                    const d = Number(p.discountPercent || 0);
                    const finalP = d > 0 ? pr * (1 - d / 100) : pr;

                    return (
                      <tr key={p.id} style={styles.tr}>
                        <td style={styles.td}>
                          <img
                            src={p.imageUrl ? `${API}${p.imageUrl}` : "https://via.placeholder.com/80x60?text=No"}
                            alt={p.name}
                            style={styles.thumb}
                          />
                        </td>

                        <td style={styles.td}>
                          <div style={{ fontWeight: 900 }}>{p.name}</div>
                          <div style={{ opacity: 0.75, fontSize: 12, marginTop: 2 }}>
                            {p.description ? p.description.slice(0, 70) + (p.description.length > 70 ? "…" : "") : "—"}
                          </div>
                        </td>

                        <td style={styles.td}>
                          <div style={{ fontWeight: 900 }}>
                            €{finalP.toFixed(2)}
                          </div>
                          {d > 0 && (
                            <div style={{ opacity: 0.65, fontSize: 12, textDecoration: "line-through" }}>
                              €{pr.toFixed(2)}
                            </div>
                          )}
                        </td>

                        <td style={styles.td}>
                          {d > 0 ? (
                            <span style={styles.pill}>-{d}%</span>
                          ) : (
                            <span style={{ opacity: 0.7 }}>—</span>
                          )}
                        </td>

                        <td style={styles.td}>
                          <span style={styles.pillSoft}>{p.quantity}</span>
                        </td>

                        <td style={{ ...styles.td, textAlign: "right" }}>
                          <button onClick={() => remove(p.id)} style={btnDangerSmall}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================== STYLES ================== */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b1220",
    color: "#e9eefb",
    padding: 24,
    fontFamily: "Inter, system-ui, sans-serif",
  },
  header: {
    maxWidth: 1200,
    margin: "0 auto 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  layout: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: 16,
  },
  panel: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 16,
  },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  tableWrap: {
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(255,255,255,0.02)",
  },
  th: {
    textAlign: "left",
    padding: "10px 10px",
    fontSize: 12,
    opacity: 0.8,
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
  },
  thRight: {
    textAlign: "right",
    padding: "10px 10px",
    fontSize: 12,
    opacity: 0.8,
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
  },
  tr: {
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  td: {
    padding: "10px 10px",
    verticalAlign: "top",
    fontSize: 13,
  },
  thumb: {
    width: 72,
    height: 54,
    objectFit: "cover",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.10)",
    display: "block",
  },
  pill: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
    background: "rgba(233,238,251,0.9)",
    color: "#0b1220",
  },
  pillSoft: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#e9eefb",
  },

  success: { marginTop: 12, color: "#b6ffcf", fontWeight: 800 },
  error: { marginTop: 12, color: "#ffb6b6", fontWeight: 800 },
};

const inp = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "#e9eefb",
  outline: "none",
};

const btn = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(233,238,251,0.9)",
  color: "#0b1220",
  fontWeight: 900,
  cursor: "pointer",
};

const btnSmall = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(233,238,251,0.9)",
  color: "#0b1220",
  fontWeight: 900,
  cursor: "pointer",
};

const btnDangerSmall = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,182,182,0.95)",
  color: "#0b1220",
  fontWeight: 900,
  cursor: "pointer",
};
